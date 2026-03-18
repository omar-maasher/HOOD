import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { detectMessagingPlatform, getSenderProfile } from '@/libs/Meta';
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
async function upsertLead(orgId: string, externalId: string, source: string, name?: string, username?: string) {
  try {
    // Ensure org row exists
    await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

    // Search for existing lead with same external ID (PSID)
    const existing = await db.query.leadSchema.findFirst({
      where: (lead, { and, eq: eqFn }) =>
        and(eqFn(lead.organizationId, orgId), eqFn(lead.externalId, externalId)),
    });

    // Fallback for old leads that only have contactMethod (ID)
    const legacy = !existing
      ? await db.query.leadSchema.findFirst({
        where: (lead, { and, eq: eqFn }) =>
          and(eqFn(lead.organizationId, orgId), eqFn(lead.contactMethod, externalId)),
      })
      : null;

    if (!existing && !legacy) {
      await db.insert(leadSchema).values({
        organizationId: orgId,
        name: name || username || externalId,
        contactMethod: username || externalId,
        username: username || null,
        externalId,
        source: source as any,
        status: 'new',
      });
      logger.info({ orgId, externalId, source }, '[WEBHOOK] New lead auto-created');
    } else {
      const match = existing || legacy;
      if (!match) {
        return;
      }

      const updates: any = {};
      if (name && (match.name === match.contactMethod || !match.name)) {
        updates.name = name;
      }
      if (username && !match.username) {
        updates.username = username;
      }
      if (externalId && !match.externalId) {
        updates.externalId = externalId;
      }
      if (username && match.contactMethod === externalId) {
        updates.contactMethod = username;
      }

      if (Object.keys(updates).length > 0) {
        await db.update(leadSchema)
          .set(updates)
          .where(eq(leadSchema.id, match.id));
      }
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

  // 3 Distinct Webhooks for n8n
  const n8nUrls = {
    whatsapp: process.env.N8N_WHATSAPP_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
    instagram: process.env.N8N_INSTAGRAM_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
    messenger: process.env.N8N_MESSENGER_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
  };

  logger.info({
    entryCount: entries.length,
    hasWhatsAppUrl: !!n8nUrls.whatsapp,
    hasInstagramUrl: !!n8nUrls.instagram,
    hasMessengerUrl: !!n8nUrls.messenger,
  }, '[WEBHOOK DEBUG] Received body');

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const entryId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // البحث عن الربط — يبحث في جميع الأنواع
    const results = await db.select().from(integrationSchema).where(eq(integrationSchema.providerId, entryId)).limit(1);
    let integration = results[0];

    logger.info({ entryId, foundIntegration: !!integration }, '[WEBHOOK DEBUG] DB lookup by providerId');

    // --- FALLBACK: Try to detect platform from payload shape, then pick best integration ---
    if (!integration) {
      const hasMessaging = messaging.length > 0; // messenger/instagram send via entry.messaging
      const hasChanges = changes.length > 0; // whatsapp sends via entry.changes

      if (hasMessaging) {
        // Try messenger integration first, then instagram
        integration = await db.query.integrationSchema.findFirst({
          where: eq(integrationSchema.type, 'messenger'),
        });
        if (!integration) {
          integration = await db.query.integrationSchema.findFirst({
            where: eq(integrationSchema.type, 'instagram'),
          });
        }
        logger.info({ fallbackType: integration?.type, entryId }, '[WEBHOOK DEBUG] Fallback: messaging event → trying messenger/instagram');
      } else if (hasChanges) {
        integration = await db.query.integrationSchema.findFirst({
          where: eq(integrationSchema.type, 'whatsapp'),
        });
        logger.info({ fallbackType: integration?.type, entryId }, '[WEBHOOK DEBUG] Fallback: changes event → trying whatsapp');
      }

      // Last resort: pick any integration
      if (!integration) {
        integration = await db.query.integrationSchema.findFirst();
        logger.info({ fallbackType: integration?.type, entryId }, '[WEBHOOK DEBUG] Last-resort fallback integration');
      }
    }

    if (!integration) {
      logger.warn({ entryId }, '[WEBHOOK DEBUG] No integration found, skipping entry');
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
      metaAccessToken: integration.accessToken || '',
      aiConfig: aiSettingsResults[0] || { isActive: 'false' },
    };

    // معالجة Messenger / Instagram
    for (const event of messaging) {
      const mid = event.message?.mid;
      if (event.message?.is_echo || !mid) {
        continue;
      }

      const senderId = event.sender?.id as string;
      // Detect platform based on MID format
      const platform = detectMessagingPlatform(mid);

      processingPromises.push((async () => {
        try {
          const exists = await db.query.webhookEventSchema.findFirst({
            where: eq(webhookEventSchema.mid, mid),
          });
          if (exists) {
            return null;
          }

          await db.insert(webhookEventSchema).values({ mid });

          // Fetch profile info (Name/Username)
          const profile = await getSenderProfile(senderId, platform, integration.accessToken || '');
          const finalName = profile?.name || senderId;
          const finalUsername = platform === 'instagram' ? (profile?.username || senderId) : senderId;

          // Auto-create/update lead with real name and username
          await upsertLead(orgId, senderId, platform, finalName, finalUsername);

          const targetUrl = n8nUrls[platform];
          if (!targetUrl) {
            return null;
          }

          return await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rawBody: body,
              platform,
              senderId,
              username: finalUsername,
              name: finalName,
              context,
            }),
          });
        } catch (e) {
          logger.error('Messenger/IG forward error', e);
          return null;
        }
      })());
    }

    // معالجة WhatsApp و Instagram Comments
    logger.info({ changesCount: changes.length }, '[WEBHOOK DEBUG] Processing Meta changes (WA/IG)');
    for (const change of changes) {
      const field = change.field;
      const value = change.value;

      // 1. WhatsApp Messages
      if (field === 'messages') {
        const messages = value?.messages || [];
        const contacts = value?.contacts || [];
        for (const msg of messages) {
          const mid = msg.id;
          const senderId = msg.from as string;
          const contactInfo = contacts.find((c: any) => c.wa_id === senderId);
          const senderName = contactInfo?.profile?.name;

          processingPromises.push(upsertLead(orgId, senderId, 'whatsapp', senderName));
          processingPromises.push((async () => {
            try {
              const exists = await db.query.webhookEventSchema.findFirst({ where: eq(webhookEventSchema.mid, mid) });
              if (exists) {
                return null;
              }
              await db.insert(webhookEventSchema).values({ mid });

              const targetUrl = n8nUrls.whatsapp;
              if (!targetUrl) {
                return null;
              }

              return await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawBody: body, platform: 'whatsapp', eventType: 'message', senderId, context }),
              });
            } catch (e) {
              logger.error('WhatsApp forward error', e);
              return null;
            }
          })());
        }
      }

      // 2. Instagram Comments / Mentions
      if (field === 'comments' || field === 'mentions') {
        const commentId = value?.id || `CMT_${Date.now()}`;
        const senderId = value?.from?.id as string;
        const senderName = value?.from?.username || value?.from?.name;
        const text = value?.text || value?.message || '';

        // منع التكرار (الصدى): إذا كان الشخص الذي علق هو نفسه صاحب الحساب/البوت
        if (senderId === integration.providerId) {
          logger.info({ senderId, providerId: integration.providerId }, '[WEBHOOK] Skipping self-comment (echo)');
          continue;
        }

        processingPromises.push((async () => {
          try {
            // منع التكرار: نتحقق إذا كان معرف التعليق معالج مسبقاً
            const exists = await db.query.webhookEventSchema.findFirst({
              where: eq(webhookEventSchema.mid, commentId),
            });
            if (exists) {
              return null;
            }

            // تسجيل المعرف لمنع معالجته مرة أخرى
            await db.insert(webhookEventSchema).values({ mid: commentId });

            if (senderId) {
              await upsertLead(orgId, senderId, 'instagram', senderName, senderName);
            }

            const targetUrl = n8nUrls.instagram;
            if (!targetUrl) {
              return null;
            }

            return await fetch(targetUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rawBody: body,
                platform: 'instagram',
                eventType: field, // 'comments' or 'mentions'
                commentId,
                senderId,
                username: senderName,
                text,
                context,
              }),
            });
          } catch (e) {
            logger.error('Instagram comment forward error', e);
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
