import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { aiSettingsSchema, integrationSchema, webhookEventSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
};

export const POST = async (request: Request) => {
  const body = await request.json();

  // Log everything for debugging
  logger.info({ body }, 'WEBHOOK_RECEIVED');

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    logger.error('N8N_WEBHOOK_URL is not defined');
    return new NextResponse('OK', { status: 200 });
  }

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const entryId = entry.id; // Page ID or WABA ID
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // 1. Fetch Integration (Strict)
    const results = await db.select().from(integrationSchema).where(eq(integrationSchema.providerId, entryId)).limit(1);
    const integration = results[0];

    // If no integration, we stop (Safe measure)
    if (!integration) {
      logger.warn({ entryId }, 'Unrecognized entry ID from Meta');
      continue;
    }

    // 2. Fetch AI Settings
    const aiSettingsResults = await db.select()
      .from(aiSettingsSchema)
      .where(eq(aiSettingsSchema.organizationId, integration.organizationId))
      .limit(1);

    const context = {
      organizationId: integration.organizationId,
      integrationType: integration.type,
      aiConfig: aiSettingsResults[0] || { isActive: 'false' },
    };

    // --- Process Messenger/Instagram ---
    for (const event of messaging) {
      const mid = event.message?.mid;
      const senderId = event.sender?.id;

      if (event.message?.is_echo || !mid) {
        continue;
      }

      processingPromises.push((async () => {
        try {
          // Check for duplicates
          const existing = await db.select().from(webhookEventSchema).where(eq(webhookEventSchema.mid, mid)).limit(1);
          if (existing.length > 0) {
            return null;
          }

          // Save mid
          await db.insert(webhookEventSchema).values({ mid });

          // Forward to n8n
          const res = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawBody: body, platform: 'messenger', senderId, context }),
          });
          logger.info({ status: res.status, mid }, 'Forwarded to n8n');
          return res;
        } catch (e) {
          logger.error({ e, mid }, 'Processing failed');
          return null;
        }
      })());
    }

    // --- Process WhatsApp ---
    for (const change of changes) {
      const messages = change.value?.messages || [];
      for (const msg of messages) {
        const mid = msg.id;
        const senderId = msg.from;

        processingPromises.push((async () => {
          try {
            // Check for duplicates (mid is unique in WhatsApp)
            const existing = await db.select().from(webhookEventSchema).where(eq(webhookEventSchema.mid, mid)).limit(1);
            if (existing.length > 0) {
              logger.info({ mid }, 'Duplicate message ignored');
              return null;
            }

            // Save mid
            await db.insert(webhookEventSchema).values({ mid });

            // Forward to n8n
            const res = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rawBody: body, platform: 'whatsapp', senderId, context }),
            });
            logger.info({ status: res.status, mid }, 'WhatsApp forwarded to n8n');
            return res;
          } catch (e) {
            logger.error({ e, mid }, 'WhatsApp forward failed');
            return null;
          }
        })());
      }
    }
  }

  // WAIT for all processing to complete before responding (Ensures serverless execution)
  if (processingPromises.length > 0) {
    await Promise.all(processingPromises);
  }

  return new NextResponse('OK', { status: 200 });
};
