import { auth } from '@clerk/nextjs/server';
import { and, eq, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { integrationSchema } from '@/models/Schema';

export const POST = async (request: Request) => {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { platform } = await request.json();

    // 1. Fetch integration to get token before deleting
    const integration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, platform),
      ),
    });

    if (integration && (platform === 'instagram' || platform === 'messenger')) {
      const pageId = integration.providerId;
      const pageToken = integration.accessToken;

      if (pageId && pageToken) {
        // --- META UNSUBSCRIBE (Best Practice: Official Unsubscription) ---
        try {
          await fetch(`https://graph.facebook.com/v21.0/${pageId}/subscribed_apps?access_token=${pageToken}`, {
            method: 'DELETE',
          });
          logger.info({ pageId, platform }, '[META] Officially unsubscribed from webhooks on disconnect');
        } catch (e) {
          logger.error(e, '[META] Failed to unsubscribe during disconnect');
        }
      }
    }

    // 2. Database Deletion Logic
    if (platform === 'instagram' || platform === 'messenger') {
      // Delete the specific selected integration
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, platform),
        ),
      );

      // If neither instagram nor messenger exist, delete facebook_root
      const remainingMeta = await db.query.integrationSchema.findFirst({
        where: and(
          eq(integrationSchema.organizationId, orgId),
          or(
            eq(integrationSchema.type, 'instagram'),
            eq(integrationSchema.type, 'messenger'),
          ),
        ),
      });
      if (!remainingMeta) {
        await db.delete(integrationSchema).where(
          and(eq(integrationSchema.organizationId, orgId), eq(integrationSchema.type, 'facebook_root')),
        );
      }
    } else if (platform === 'whatsapp') {
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, 'whatsapp'),
        ),
      );
    } else {
      // Catch-all for generic platforms (shopify, salla, custom, scraper, etc)
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, platform),
        ),
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Disconnect Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
