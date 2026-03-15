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
 * Meta requires the App Access Token (appId|appSecret) for this call.
 * Docs: https://developers.facebook.com/docs/whatsapp/embedded-signup/webhooks
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

    // Meta requires different tokens for subscribed_apps - try in this order:
    // 1. App Access Token (appId|appSecret) - most reliable for subscribed_apps
    // 2. System User Token - works if system user has admin access to the WABA
    // 3. Integration Token - last resort
    const appAccessToken = `${META_CONFIG.appId}|${META_CONFIG.appSecret}`;
    const tokensToTry = [
      { name: 'App Access Token', token: appAccessToken },
      { name: 'System User Token', token: META_CONFIG.systemUserToken },
      { name: 'Integration Token', token: integration.accessToken },
    ].filter(t => !!t.token);

    logger.info({ wabaId, orgId, tokenOptions: tokensToTry.map(t => t.name) }, 'Re-subscribing app to WABA webhooks');

    const subscribeUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/subscribed_apps`;

    let lastError: any = null;
    for (const { name, token } of tokensToTry) {
      const subscribeRes = await fetch(subscribeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const subscribeData = await subscribeRes.json();

      if (subscribeRes.ok) {
        logger.info({ wabaId, tokenUsed: name, subscribeData }, 'Successfully re-subscribed app to WABA webhooks');
        return NextResponse.json({ success: true, wabaId, tokenUsed: name, result: subscribeData });
      }

      logger.warn({ wabaId, tokenUsed: name, subscribeData }, 'WABA resubscribe attempt failed, trying next token');
      lastError = { name, subscribeData };
    }

    return NextResponse.json({
      error: 'All token attempts failed for subscribed_apps',
      lastAttempt: lastError,
    }, { status: 500 });
  } catch (error: any) {
    logger.error(error, 'WhatsApp resubscribe error');
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
};
