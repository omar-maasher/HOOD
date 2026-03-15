import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { aiSettingsSchema, integrationSchema, leadSchema, organizationSchema, webhookEventSchema } from '@/models/Schema';

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

/**
 * Upsert a lead when we receive a new incoming message.
 * If a lead with the same contactMethod already exists in this org, skip insertion.
 */
async function upsertLead(orgId: string, contactMethod: string, source: string, name?: string) {
  try {
    // Ensure org row exists
    await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

    // Search for existing lead with same contact
    const existing = await db.query.leadSchema.findFirst({
      where: (lead, { and, eq: eqFn }) =>
        and(eqFn(lead.organizationId, orgId), eqFn(lead.contactMethod, contactMethod)),
    });

    if (!existing) {
      await db.insert(leadSchema).values({
        organizationId: orgId,
        name: name || contactMethod, // fallback to phone/id if no name
        contactMethod,
        source,
        status: 'new',
      });
      logger.info({ orgId, contactMethod, source }, '[WEBHOOK] New lead auto-created');
    }
  } catch (e) {
    logger.error(e, '[WEBHOOK] Failed to upsert lead');
  }
}

export const POST = async (request: Request) => {
  const body = await request.json();

  // Print raw webhook to Vercel logs to verify Meta is sending data
  logger.info({ webhookBody: body }, 'Incoming Meta Webhook');

  // 1. تسجيل الطلب الخام فوراً للـ Debug
  const rawId = `RAW_${Date.now()}`;
  await db.insert(webhookEventSchema).values({ mid: rawId }).catch(() => null);

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  logger.info({ entryCount: entries.length, hasN8nUrl: !!n8nWebhookUrl }, '[WEBHOOK DEBUG] Received body');

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const entryId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // البحث عن الربط
    const results = await db.select().from(integrationSchema).where(eq(integrationSchema.providerId, entryId)).limit(1);
    let integration = results[0];

    logger.info({ entryId, foundIntegration: !!integration }, '[WEBHOOK DEBUG] DB lookup by providerId');

    // --- FALLBACK FOR TESTING ---
    if (!integration) {
      logger.info({ entryId }, '[WEBHOOK DEBUG] No matching integration by ID, using fallback (first whatsapp integration)');
      integration = await db.query.integrationSchema.findFirst({
        where: eq(integrationSchema.type, 'whatsapp'),
      });
      logger.info({ fallbackOrgId: integration?.organizationId }, '[WEBHOOK DEBUG] Fallback integration found');
    }

    if (!integration) {
      continue;
    }

    const orgId = integration.organizationId;

    const aiSettingsResults = await db.select()
      .from(aiSettingsSchema)
      .where(eq(aiSettingsSchema.organizationId, orgId))
      .limit(1);

    const context = {
      organizationId: orgId,
      integrationType: integration.type,
      aiConfig: aiSettingsResults[0] || { isActive: 'false' },
    };

    // معالجة Messenger / Instagram
    for (const event of messaging) {
      const mid = event.message?.mid;
      if (event.message?.is_echo || !mid) {
        continue;
      }

      const senderId = event.sender?.id as string;
      const platform = integration.type === 'instagram' ? 'instagram' : 'messenger';

      // Auto-create lead for this sender
      processingPromises.push(upsertLead(orgId, senderId, platform));

      processingPromises.push((async () => {
        try {
          const exists = await db.select().from(webhookEventSchema).where(eq(webhookEventSchema.mid, mid)).limit(1);
          if (exists.length > 0) {
            return null;
          }

          await db.insert(webhookEventSchema).values({ mid });

          if (!n8nWebhookUrl) {
            return null;
          }

          return await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawBody: body, platform, senderId, context }),
          });
        } catch (e) {
          logger.error('Messenger/IG forward error', e);
          return null;
        }
      })());
    }

    // معالجة WhatsApp
    logger.info({ changesCount: changes.length }, '[WEBHOOK DEBUG] Processing WhatsApp changes');
    for (const change of changes) {
      const messages = change.value?.messages || [];
      const contacts = change.value?.contacts || [];
      logger.info({ messagesCount: messages.length, field: change.field }, '[WEBHOOK DEBUG] Change entry');
      for (const msg of messages) {
        const mid = msg.id;
        const senderId = msg.from as string; // phone number e.g. "966501234567"

        // Try to get the sender's name from contacts array in the webhook payload
        const contactInfo = contacts.find((c: any) => c.wa_id === senderId);
        const senderName = contactInfo?.profile?.name;

        // Auto-create lead
        processingPromises.push(upsertLead(orgId, senderId, 'whatsapp', senderName));

        processingPromises.push((async () => {
          try {
            const exists = await db.select().from(webhookEventSchema).where(eq(webhookEventSchema.mid, mid)).limit(1);
            if (exists.length > 0) {
              return null;
            }

            await db.insert(webhookEventSchema).values({ mid });

            logger.info({ mid, senderId }, '[WEBHOOK DEBUG] Forwarding WhatsApp message to n8n');

            if (!n8nWebhookUrl) {
              return null;
            }

            const res = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rawBody: body, platform: 'whatsapp', senderId, context }),
            });
            logger.info({ status: res.status, ok: res.ok }, '[WEBHOOK DEBUG] N8N forward response');
            return res;
          } catch (e) {
            logger.error('WhatsApp forward error', e);
            return null;
          }
        })());
      }
    }
  }

  // الانتظار لضمان عدم قتل العملية في Vercel قبل وصول الطلب لـ n8n
  if (processingPromises.length > 0) {
    await Promise.all(processingPromises);
  }

  return new NextResponse('OK', { status: 200 });
};
