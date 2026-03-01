import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { aiSettingsSchema, integrationSchema } from '@/models/Schema';

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

// Simple in-memory cache to prevent duplicate processing of the same message ID (mid)
const processedMids = new Set<string>();
const MAX_CACHE_SIZE = 500;

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

      // DEDUPLICATION: Skip if we already processed this message ID
      if (mid && processedMids.has(mid)) {
        // eslint-disable-next-line no-console
        console.log(`Skipping duplicate message mid: ${mid}`);
        continue;
      }

      // Skip echoes and other system events
      if (
        event.message?.is_echo
        || event.sender?.id === pageId
        || event.delivery
        || event.read
      ) {
        continue;
      }

      // Add to cache
      if (mid) {
        processedMids.add(mid);
        if (processedMids.size > MAX_CACHE_SIZE) {
          const firstItem = processedMids.values().next().value;
          if (firstItem) {
            processedMids.delete(firstItem);
          }
        }
      }

      processingPromises.push((async () => {
        try {
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
          return null; // Ensure all paths return a value
        }
      })());
    }

    // --- 2. HANDLE CHANGES (WhatsApp) ---
    for (const change of changes) {
      const waValue = change.value;
      if (waValue?.statuses || !waValue?.messages) {
        continue;
      }

      const waMid = waValue.messages?.[0]?.id;
      if (waMid && processedMids.has(waMid)) {
        continue;
      }

      if (waMid) {
        processedMids.add(waMid);
        if (processedMids.size > MAX_CACHE_SIZE) {
          const firstItem = processedMids.values().next().value;
          if (firstItem) {
            processedMids.delete(firstItem);
          }
        }
      }

      processingPromises.push((async () => {
        try {
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
          return null; // Ensure all paths return a value
        }
      })());
    }
  }

  // Await all parallel n8n calls
  if (processingPromises.length > 0) {
    await Promise.all(processingPromises);
  }

  // Acknowledge receipt to Meta
  return new NextResponse('OK', { status: 200 });
};
