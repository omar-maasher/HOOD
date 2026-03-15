import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { META_CONFIG } from '@/libs/Meta';
import { integrationSchema } from '@/models/Schema';

/**
 * POST /api/integrations/whatsapp/resubscribe
 *
 * Force-subscribe the app to the WABA webhooks for an existing integration.
 * This fixes "no webhook events" for integrations registered before subscribed_apps was added.
 */
export const POST = async (_request: Request) => {
  const { orgId, userId } = await auth();

  if (!orgId || !userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Find the existing WhatsApp integration for this org
    const integration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, 'whatsapp'),
      ),
    });

    if (!integration) {
      return NextResponse.json({ error: 'No WhatsApp integration found for this organization.' }, { status: 404 });
    }

    const wabaId = integration.providerId; // WABA ID stored as providerId
    const accessToken = integration.accessToken;

    // Use System User Token if available (preferred), else use the integration's token
    const tokenToUse = META_CONFIG.systemUserToken || accessToken;

    logger.info({ wabaId, orgId }, 'Re-subscribing app to WABA webhooks');

    // 2. Call subscribed_apps
    const subscribeUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/subscribed_apps`;
    const subscribeRes = await fetch(subscribeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
        'Content-Type': 'application/json',
      },
    });

    const subscribeData = await subscribeRes.json();

    if (!subscribeRes.ok) {
      logger.warn({ subscribeData, wabaId }, 'WABA resubscribe failed');
      return NextResponse.json({
        error: 'Failed to subscribe app to WABA webhooks',
        details: subscribeData,
      }, { status: 500 });
    }

    logger.info({ wabaId, subscribeData }, 'Successfully re-subscribed app to WABA webhooks');

    return NextResponse.json({
      success: true,
      wabaId,
      result: subscribeData,
    });
  } catch (error: any) {
    logger.error(error, 'WhatsApp resubscribe error');
    return NextResponse.json({
      error: error?.message || String(error),
    }, { status: 500 });
  }
};
