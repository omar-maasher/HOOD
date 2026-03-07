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

  // 1. تسجل فوري في قاعدة البيانات لإثبات أن ميتا وصلت للسيرفر
  // سنستخدم معرف (mid) يبدأ بـ RAW_ لتمييز الطلبات الخام
  const rawId = `RAW_${Date.now()}`;
  try {
    await db.insert(webhookEventSchema).values({ mid: rawId });
    logger.info({ rawId }, 'Incoming Webhook Registered');
  } catch (err) {
    logger.error({ err }, 'Failed to log raw webhook');
  }

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    logger.error('N8N_WEBHOOK_URL missing');
    return new NextResponse('OK', { status: 200 });
  }

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const entryId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    const integrationPromise = (async () => {
      const results = await db.select().from(integrationSchema).where(eq(integrationSchema.providerId, entryId)).limit(1);
      let integration = results[0];

      if (!integration) {
        const anyIntegration = await db.query.integrationSchema.findFirst();
        if (anyIntegration) {
          integration = anyIntegration;
        } else {
          return null;
        }
      }

      const aiSettingsResults = await db.select().from(aiSettingsSchema).where(eq(aiSettingsSchema.organizationId, integration.organizationId)).limit(1);
      return {
        organizationId: integration.organizationId,
        integrationType: integration.type,
        aiConfig: aiSettingsResults[0] || { isActive: 'false' },
      };
    })();

    // --- 1. Messenger/Instagram ---
    for (const event of messaging) {
      const mid = event.message?.mid;
      const senderId = event.sender?.id;
      if (event.message?.is_echo || !mid) {
        continue;
      }

      processingPromises.push((async () => {
        const context = await integrationPromise;
        await db.insert(webhookEventSchema).values({ mid }).catch(() => null);
        return await fetch(n8nWebhookUrl!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawBody: body, platform: 'messenger', senderId, context }),
        });
      })());
    }

    // --- 2. WhatsApp ---
    for (const change of changes) {
      if (!change.value?.messages) {
        continue;
      }
      for (const msg of change.value.messages) {
        const mid = msg.id;
        const senderId = msg.from;
        processingPromises.push((async () => {
          const context = await integrationPromise;
          // تسجيل الـ mid الحقيقي للرسالة
          await db.insert(webhookEventSchema).values({ mid }).catch(() => null);
          logger.info({ mid }, 'Forwarding WhatsApp to n8n');
          return await fetch(n8nWebhookUrl!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawBody: body, platform: 'whatsapp', senderId, context }),
          });
        })());
      }
    }
  }

  await Promise.all(processingPromises);
  return new NextResponse('OK', { status: 200 });
};
