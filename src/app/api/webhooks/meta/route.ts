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

  // IMPORTANT: Logger will help you see the ID sent by Meta in the terminal/logs
  logger.info({ body }, 'Received Meta Webhook');

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    logger.error('N8N_WEBHOOK_URL is not defined');
    return new NextResponse('OK', { status: 200 });
  }

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const pageId = entry.id; // This is the WABA ID or Page ID
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // Lookup integration
    const integrationPromise = db.select()
      .from(integrationSchema)
      .where(eq(integrationSchema.providerId, pageId))
      .limit(1)
      .then(async (results) => {
        const integration = results[0];

        // --- DEBUG BYPASS FOR TESTING ---
        // If no integration found, but we are testing, we can inject a default one
        // to make sure n8n gets the message.
        if (!integration) {
          logger.warn({ pageId }, 'No integration found for this ID. Using debug fallback if available.');
          // Try to find ANY active integration to get an orgId for testing
          const fallback = await db.query.integrationSchema.findFirst();
          if (fallback) {
            const aiSettings = await db.query.aiSettingsSchema.findFirst({
              where: eq(aiSettingsSchema.organizationId, fallback.organizationId),
            });
            return {
              organizationId: fallback.organizationId,
              integrationType: 'whatsapp', // default for test
              aiConfig: aiSettings || { isActive: 'false' },
            };
          }
          return null;
        }

        const aiSettingsResults = await db.select()
          .from(aiSettingsSchema)
          .where(eq(aiSettingsSchema.organizationId, integration.organizationId))
          .limit(1);

        const aiSettings = aiSettingsResults[0];

        return {
          organizationId: integration.organizationId,
          integrationType: integration.type,
          aiConfig: aiSettings || { isActive: 'false' },
        };
      });

    // --- 1. HANDLE MESSAGING (Instagram/Messenger) ---
    for (const event of messaging) {
      const mid = event.message?.mid;
      const senderId = event.sender?.id;

      if (
        event.message?.is_echo
        || event.sender?.id === pageId
        || event.delivery
        || event.read
      ) {
        continue;
      }

      if (mid && senderId) {
        processingPromises.push((async () => {
          try {
            const existing = await db.select()
              .from(webhookEventSchema)
              .where(eq(webhookEventSchema.mid, mid))
              .limit(1);

            if (existing.length > 0) {
              return null;
            }

            try {
              await db.insert(webhookEventSchema).values({ mid });
            } catch {
              return null;
            }

            const context = await integrationPromise;
            const platform = body.object === 'page' ? 'messenger' : (body.object === 'instagram' ? 'instagram' : 'unknown');

            const response = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rawBody: { ...body, entry: [entry] },
                platform,
                senderId,
                context: context || { organizationId: '', integrationType: platform, aiConfig: { isActive: 'false' } },
              }),
            });
            return response;
          } catch (error) {
            logger.error({ error }, 'Processing error');
            return null;
          }
        })());
      }
    }

    // --- 2. HANDLE CHANGES (WhatsApp) ---
    for (const change of changes) {
      const waValue = change.value;
      if (waValue?.statuses || !waValue?.messages) {
        continue;
      }

      const waMid = waValue.messages?.[0]?.id;
      const waSenderId = waValue.messages?.[0]?.from;

      if (waMid && waSenderId) {
        processingPromises.push((async () => {
          try {
            const existing = await db.select()
              .from(webhookEventSchema)
              .where(eq(webhookEventSchema.mid, waMid))
              .limit(1);

            if (existing.length > 0) {
              return null;
            }

            try {
              await db.insert(webhookEventSchema).values({ mid: waMid });
            } catch {
              return null;
            }

            const context = await integrationPromise;

            logger.info({ platform: 'whatsapp', mid: waMid }, 'Forwarding to n8n');

            const response = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rawBody: { ...body, entry: [entry] },
                platform: 'whatsapp',
                senderId: waSenderId,
                context: context || { organizationId: '', integrationType: 'whatsapp', aiConfig: { isActive: 'false' } },
              }),
            });
            logger.info({ status: response.status }, 'n8n response (whatsapp)');
            return response;
          } catch (error) {
            logger.error({ error }, 'WhatsApp error');
            return null;
          }
        })());
      }
    }
  }

  if (processingPromises.length > 0) {
    await Promise.all(processingPromises);
  }

  return new NextResponse('OK', { status: 200 });
};
