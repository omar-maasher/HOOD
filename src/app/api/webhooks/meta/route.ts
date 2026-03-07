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

  // Log the body for debugging in server environment logs
  logger.info({ body }, 'INCOMING_WEBHOOK_PAYLOAD');

  logger.info({ body }, 'Received Meta Webhook');

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    logger.error('N8N_WEBHOOK_URL is not defined');
    return new NextResponse('OK', { status: 200 });
  }

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const entryId = entry.id; // WABA ID or Page ID
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // Lookup integration
    const integrationPromise = (async () => {
      const results = await db.select()
        .from(integrationSchema)
        .where(eq(integrationSchema.providerId, entryId))
        .limit(1);

      let integration = results[0];

      // FALLBACK FOR TESTING/DEBUG: If ID doesn't match, pick the first one from DB
      if (!integration) {
        logger.warn({ entryId }, 'No matching integration found. Using first available for testing.');
        const anyIntegration = await db.query.integrationSchema.findFirst();
        if (anyIntegration) {
          integration = anyIntegration;
        } else {
          return null;
        }
      }

      const aiSettingsResults = await db.select()
        .from(aiSettingsSchema)
        .where(eq(aiSettingsSchema.organizationId, integration.organizationId))
        .limit(1);

      return {
        organizationId: integration.organizationId,
        integrationType: integration.type,
        aiConfig: aiSettingsResults[0] || { isActive: 'false' },
      };
    })();

    // --- 1. HANDLE MESSAGING (Instagram/Messenger) ---
    for (const event of messaging) {
      const mid = event.message?.mid;
      const senderId = event.sender?.id;

      if (event.message?.is_echo || !mid) {
        continue;
      }

      processingPromises.push((async () => {
        try {
          const existing = await db.select().from(webhookEventSchema).where(eq(webhookEventSchema.mid, mid)).limit(1);
          if (existing.length > 0) {
            return null;
          }
          await db.insert(webhookEventSchema).values({ mid }).catch(() => null);

          const context = await integrationPromise;
          const platform = body.object === 'page' ? 'messenger' : (body.object === 'instagram' ? 'instagram' : 'unknown');

          logger.info({ platform, mid, senderId }, 'Forwarding messaging to n8n');

          return await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rawBody: { ...body, entry: [entry] },
              platform,
              senderId: senderId || 'unknown',
              context: context || { organizationId: '', integrationType: platform, aiConfig: { isActive: 'false' } },
            }),
          });
        } catch (error) {
          logger.error({ error }, 'Messenger error');
          return null;
        }
      })());
    }

    // --- 2. HANDLE CHANGES (WhatsApp) ---
    for (const change of changes) {
      const value = change.value;
      if (!value?.messages) {
        continue;
      }

      for (const msg of value.messages) {
        const mid = msg.id;
        const senderId = msg.from;

        processingPromises.push((async () => {
          try {
            const existing = await db.select().from(webhookEventSchema).where(eq(webhookEventSchema.mid, mid)).limit(1);
            if (existing.length > 0) {
              return null;
            }
            await db.insert(webhookEventSchema).values({ mid }).catch(() => null);

            const context = await integrationPromise;

            logger.info({ mid, senderId }, 'Forwarding WhatsApp to n8n');

            return await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rawBody: { ...body, entry: [entry] },
                platform: 'whatsapp',
                senderId,
                context: context || { organizationId: '', integrationType: 'whatsapp', aiConfig: { isActive: 'false' } },
              }),
            });
          } catch (error) {
            logger.error({ error }, 'WhatsApp error');
            return null;
          }
        })());
      }
    }
  }

  await Promise.all(processingPromises);
  return new NextResponse('OK', { status: 200 });
};
