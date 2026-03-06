import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
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

  // eslint-disable-next-line no-console
  console.log('Received Meta Webhook:', JSON.stringify(body, null, 2));

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    return new NextResponse('OK', { status: 200 });
  }

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const pageId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // Optimize: Fetch integration ONCE per entry instead of per message
    const integrationPromise = db.query.integrationSchema.findFirst({
      where: eq(integrationSchema.providerId, pageId),
    }).then(async (integration) => {
      if (!integration) {
        return null;
      }

      const aiSettings = await db.query.aiSettingsSchema.findFirst({
        where: eq(aiSettingsSchema.organizationId, integration.organizationId),
      });

      return {
        organizationId: integration.organizationId,
        integrationType: integration.type,
        aiConfig: aiSettings || { isActive: 'false' },
      };
    });

    // --- 1. HANDLE MESSAGING (Instagram/Messenger) ---
    for (const event of messaging) {
      const mid = event.message?.mid;

      // Skip echoes and other system events
      if (
        event.message?.is_echo
        || event.sender?.id === pageId
        || event.delivery
        || event.read
      ) {
        continue;
      }

      if (mid) {
        processingPromises.push((async () => {
          try {
            // DEDUPLICATION: Check if we already processed this message ID in DB
            const existing = await db.query.webhookEventSchema.findFirst({
              where: eq(webhookEventSchema.mid, mid),
            });

            if (existing) {
              // eslint-disable-next-line no-console
              console.log(`Skipping duplicate message mid: ${mid}`);
              return;
            }

            // Insert immediately to lock the message ID
            try {
              await db.insert(webhookEventSchema).values({ mid });
            } catch {
              // Duplicate insertion error (race condition)
              return;
            }

            const context = await integrationPromise;
            const platform = body.object === 'page' ? 'messenger' : (body.object === 'instagram' ? 'instagram' : 'unknown');

            const response = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rawBody: { ...body, entry: [entry] },
                platform,
                context: context || { organizationId: '', integrationType: platform, aiConfig: { isActive: 'false' } },
              }),
            });
            return response;
          } catch (error) {
            console.error('Messaging processing error:', error);
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

      if (waMid) {
        processingPromises.push((async () => {
          try {
            // DEDUPLICATION
            const existing = await db.query.webhookEventSchema.findFirst({
              where: eq(webhookEventSchema.mid, waMid),
            });

            if (existing) {
              return;
            }

            try {
              await db.insert(webhookEventSchema).values({ mid: waMid });
            } catch {
              return;
            }

            const context = await integrationPromise;
            const response = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rawBody: { ...body, entry: [entry] },
                platform: 'whatsapp',
                context: context || { organizationId: '', integrationType: 'whatsapp', aiConfig: { isActive: 'false' } },
              }),
            });
            return response;
          } catch (error) {
            console.error('WhatsApp processing error:', error);
            return null;
          }
        })());
      }
    }
  }

  // CRITICAL: We respond TO META immediately to prevent retries (double replies)
  // We do not await processingPromises here.
  if (processingPromises.length > 0) {
    // Process in background
    Promise.all(processingPromises).catch((err) => {
      console.error('Background processing error:', err);
    });
  }

  // Acknowledge receipt to Meta immediately
  return new NextResponse('OK', { status: 200 });
};
