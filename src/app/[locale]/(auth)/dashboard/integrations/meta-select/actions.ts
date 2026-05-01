'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { integrationSchema } from '@/models/Schema';

export async function subscribeToMetaPage(pageId: string, pageToken: string, platform: string, igAccountId?: string, igUsername?: string, igProfilePic?: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  // 1. Subscribe to Webhooks
  let subscribedFields = ['messages', 'messaging_postbacks'];
  let subscribeTargetId = pageId;

  if (platform === 'instagram') {
    subscribedFields = ['messages', 'messaging_postbacks', 'comments', 'mentions'];
    // For Instagram via Facebook, we still subscribe the Facebook Page ID!
  }

  const subRes = await fetch(`https://graph.facebook.com/v21.0/${subscribeTargetId}/subscribed_apps?access_token=${pageToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscribed_fields: subscribedFields }),
  });

  if (!subRes.ok) {
    const errData = await subRes.json();
    logger.error({ errData }, 'Subscribe failed');
    throw new Error('فشل الاشتراك في خدمة Webhooks من ميتا. تأكد من صلاحيات التطبيق.');
  }

  // 2. Save Integration to DB
  const existingIntegration = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.organizationId, orgId),
      eq(integrationSchema.type, platform),
    ),
  });

  if (platform === 'messenger') {
    if (existingIntegration) {
      await db.update(integrationSchema)
        .set({ accessToken: pageToken, providerId: pageId, updatedAt: new Date() })
        .where(eq(integrationSchema.id, existingIntegration.id));
    } else {
      await db.insert(integrationSchema).values({
        organizationId: orgId,
        type: 'messenger',
        providerId: pageId,
        accessToken: pageToken,
        status: 'active',
      });
    }
  } else if (platform === 'instagram') {
    const config = JSON.stringify({ igAccountId, method: 'facebook_login', username: igUsername, profilePic: igProfilePic });
    
    if (existingIntegration) {
      await db.update(integrationSchema)
        .set({ accessToken: pageToken, providerId: pageId, config, updatedAt: new Date() })
        .where(eq(integrationSchema.id, existingIntegration.id));
    } else {
      await db.insert(integrationSchema).values({
        organizationId: orgId,
        type: 'instagram',
        providerId: pageId,
        accessToken: pageToken,
        config,
        status: 'active',
      });
    }
  }

  return { success: true };
}
