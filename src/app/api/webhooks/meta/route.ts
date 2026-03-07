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
  // 1. قراءة البيانات فوراً
  let body;
  try {
    body = await request.json();
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  // 2. تسجيل RAW ID فوراً لإثبات الوصول
  const rawId = `RAW_${Date.now()}`;
  db.insert(webhookEventSchema).values({ mid: rawId }).catch(() => null);

  // 3. معالجة البيانات في "الخلفية" وعدم تعطيل الرد على ميتا
  (async () => {
    try {
      const entries = body.entry || [];
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
      if (!n8nWebhookUrl) {
        return;
      }

      for (const entry of entries) {
        const entryId = entry.id;
        const messaging = entry.messaging || [];
        const changes = entry.changes || [];

        // Lookup Integration
        const results = await db.select().from(integrationSchema).where(eq(integrationSchema.providerId, entryId)).limit(1);
        const integration = results[0] || (await db.query.integrationSchema.findFirst());
        if (!integration) {
          continue;
        }

        const aiSettingsResults = await db.select().from(aiSettingsSchema).where(eq(aiSettingsSchema.organizationId, integration.organizationId)).limit(1);
        const context = {
          organizationId: integration.organizationId,
          integrationType: integration.type,
          aiConfig: aiSettingsResults[0] || { isActive: 'false' },
        };

        // Handle Messenger
        for (const event of messaging) {
          if (event.message?.is_echo || !event.message?.mid) {
            continue;
          }
          await db.insert(webhookEventSchema).values({ mid: event.message.mid }).catch(() => null);
          fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawBody: body, platform: 'messenger', senderId: event.sender?.id, context }),
          }).catch(() => null);
        }

        // Handle WhatsApp
        for (const change of changes) {
          if (!change.value?.messages) {
            continue;
          }
          for (const msg of change.value.messages) {
            await db.insert(webhookEventSchema).values({ mid: msg.id }).catch(() => null);
            fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rawBody: body, platform: 'whatsapp', senderId: msg.from, context }),
            }).catch(() => null);
          }
        }
      }
    } catch (err) {
      console.error('Background processing error:', err);
    }
  })();

  // 4. الرد على ميتا بـ OK فوراً (أهم خطوة)
  return new NextResponse('OK', { status: 200 });
};
