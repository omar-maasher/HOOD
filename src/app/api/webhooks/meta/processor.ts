import { and, eq, isNotNull, sql } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { detectMessagingPlatform, getSenderProfile, sendWhatsAppButtonsMessage, sendWhatsAppListMessage } from '@/libs/Meta';
import { notifyOrg } from '@/libs/Notifications';
import {
  aiSettingsSchema,
  businessProfileSchema,
  conversationSchema,
  integrationSchema,
  leadSchema,
  messageSchema,
  organizationSchema,
  productSchema,
  webhookEventSchema,
} from '@/models/Schema';

export async function upsertLead(orgId: string, externalId: string, source: string, name?: string, username?: string) {
  try {
    await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

    const existing = await db.query.leadSchema.findFirst({
      where: (lead, { and, eq: eqFn }) =>
        and(eqFn(lead.organizationId, orgId), eqFn(lead.externalId, externalId)),
    });

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

export async function processMetaWebhookPayload(body: any) {
  const rawId = `RAW_${Date.now()}`;
  await db.insert(webhookEventSchema).values({ mid: rawId }).catch(() => null);

  const entries = body.entry || [];

  const n8nUrls = {
    whatsapp: process.env.N8N_WHATSAPP_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
    instagram: process.env.N8N_INSTAGRAM_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
    messenger: process.env.N8N_MESSENGER_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
  };

  logger.info({
    entryCount: entries.length,
    n8nUrls: {
      whatsapp: !!n8nUrls.whatsapp,
      instagram: !!n8nUrls.instagram,
      messenger: !!n8nUrls.messenger,
    },
  }, '[WEBHOOK DEBUG] Received Meta Webhook');

  const processingPromises: Promise<any>[] = [];

  for (const entry of entries) {
    const entryId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    let integration = await db.query.integrationSchema.findFirst({
      where: (i, { and: andFn, or, eq: eqFn, ilike }) =>
        andFn(
          eqFn(i.status, 'active'),
          or(
            eqFn(i.providerId, entryId),
            ilike(i.config, `%${entryId}%`),
          ),
        ),
    });

    if (!integration) {
      const allDirectIg = await db.query.integrationSchema.findMany({
        where: (i, { and: andFn, eq: eqFn, ilike }) => andFn(
          eqFn(i.status, 'active'),
          eqFn(i.type, 'instagram'),
          ilike(i.config, '%"method":"instagram_direct"%'),
        ),
      });

      let healed = false;
      for (const candidate of allDirectIg) {
        if (!candidate.accessToken) {
          continue;
        }
        try {
          let customerSenderId = '';
          if (entry.messaging && entry.messaging.length > 0) {
            const isEcho = entry.messaging[0].message?.is_echo === true;
            customerSenderId = isEcho ? entry.messaging[0].recipient?.id : entry.messaging[0].sender?.id;
          } else if (entry.standby && entry.standby.length > 0) {
            const isEcho = entry.standby[0].message?.is_echo === true;
            customerSenderId = isEcho ? entry.standby[0].recipient?.id : entry.standby[0].sender?.id;
          } else if (changes && changes.length > 0) {
            customerSenderId = changes[0].value?.from?.id;
          }

          if (!customerSenderId) {
            continue;
          }

          const testUrl = `https://graph.instagram.com/v21.0/me/messages`;
          const testRes = await fetch(`${testUrl}?access_token=${candidate.accessToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipient: { id: customerSenderId },
              sender_action: 'typing_on',
            }),
          });

          if (testRes.ok) {
            await db.update(integrationSchema)
              .set({ providerId: entryId })
              .where(eq(integrationSchema.id, candidate.id));

            integration = { ...candidate, providerId: entryId };
            healed = true;
            logger.info({ entryId, orgId: candidate.organizationId }, '[WEBHOOK DEBUG] Auto-healed Instagram Direct providerId via Typing brute-force!');
            break;
          } else {
            const err = await testRes.json();
            logger.warn({ errorMessage: err.error?.message, candidateId: candidate.id }, '[WEBHOOK DEBUG] Typing brute force failed for candidate');
          }
        } catch (e) {
          logger.error({ error: String(e) }, '[WEBHOOK DEBUG] Error during token debug');
        }
      }

      if (!healed) {
        logger.warn({ entryId }, '[WEBHOOK DEBUG] No ACTIVE integration found for this Provider ID. Skipping.');
        continue;
      }
    }

    if (!integration) {
      continue;
    }

    const orgId = integration.organizationId;
    logger.info({ entryId, orgId, type: integration.type }, '[WEBHOOK DEBUG] Found Integration');

    const aiSettingsResults = await db.select()
      .from(aiSettingsSchema)
      .where(eq(aiSettingsSchema.organizationId, orgId))
      .limit(1);

    const businessProfile = await db.query.businessProfileSchema.findFirst({
      where: eq(businessProfileSchema.organizationId, orgId),
    });

    const products = await db.query.productSchema.findMany({
      where: eq(productSchema.organizationId, orgId),
    });

    const context = {
      organizationId: orgId,
      integrationType: integration.type,
      metaAccessToken: integration.accessToken || '',
      aiConfig: aiSettingsResults[0] || { isActive: 'true', isCommentsActive: 'true' },
      businessSummary: {
        name: businessProfile?.businessName || '',
        type: businessProfile?.businessType || '',
        description: businessProfile?.businessDescription || '',
        phoneNumber: businessProfile?.phoneNumber || '',
        address: businessProfile?.address || '',
        policy: businessProfile?.policies || '',
        workingHours: businessProfile?.workingHours || '',
        storeLatitude: businessProfile?.storeLatitude || '',
        storeLongitude: businessProfile?.storeLongitude || '',
        deliveryPricePerKm: businessProfile?.deliveryPricePerKm || '',
        isDeliveryEnabled: businessProfile?.isDeliveryEnabled || 'false',
      },
      products: products.map(p => ({
        name: p.name,
        price: p.price,
        currency: p.currency,
        description: p.description,
        category: p.category,
      })),
      systemInstructions: `
        - You are ${aiSettingsResults[0]?.botName || 'Store Assistant'}.
        - The user is interacting via Instagram Comments.
        - Public comments should be helpful, concise, and professional.
        - If the user asks about prices, use the provided product list.
        - Use a ${aiSettingsResults[0]?.tone || 'friendly'} tone.
      `,
    };

    for (const event of messaging) {
      const mid = event.message?.mid;
      if (!mid && !event.message?.attachments) {
        continue;
      }

      const isEcho = event.message?.is_echo === true;
      const senderId = (isEcho ? event.recipient?.id : event.sender?.id) as string;

      const messageText = event.message?.text || '';
      const hasAttachments = !!(event.message?.attachments && event.message.attachments.length > 0);
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

          let finalName = senderId;
          let finalUsername = senderId;

          if (!isEcho) {
            let isDirectLogin = false;
            try {
              const cfg = JSON.parse(integration.config || '{}');
              if (cfg.method === 'instagram_direct') {
                isDirectLogin = true;
              }
            } catch {}

            const profile = await getSenderProfile(senderId, platform, integration.accessToken || '', isDirectLogin);
            finalName = profile?.name || senderId;
            finalUsername = platform === 'instagram' ? (profile?.username || senderId) : senderId;

            await upsertLead(orgId, senderId, platform, finalName, finalUsername);
          }

          const conversation = await db.insert(conversationSchema)
            .values({
              organizationId: orgId,
              platform,
              externalId: senderId,
              customerName: finalName,
              lastMessage: messageText,
              lastMessageAt: new Date(),
              isUnread: 'true',
            })
            .onConflictDoUpdate({
              target: [conversationSchema.organizationId, conversationSchema.platform, conversationSchema.externalId],
              set: {
                lastMessage: messageText,
                lastMessageAt: new Date(),
                isUnread: 'true',
              },
            })
            .returning();

          if (conversation[0]) {
            await db.insert(messageSchema).values({
              organizationId: orgId,
              conversationId: conversation[0].id,
              direction: isEcho ? 'outgoing' : 'incoming',
              text: messageText,
              type: hasAttachments ? 'image' : 'text',
              senderType: isEcho ? 'bot' : 'customer',
              metadata: mid,
            });
          }

          if (isEcho) {
            return null;
          }

          await notifyOrg(orgId, `رسالة ${platform} جديدة`, `${finalName}: ${messageText}`, {
            conversationId: conversation[0]?.id,
            platform,
            externalId: senderId,
            link: `/ar/dashboard/inbox?id=${conversation[0]?.id}`,
          });

          const finalPlatform = integration.type === 'instagram' ? 'instagram' : platform;

          const isActive = String((context.aiConfig as any).isActive) !== 'false';
          if (!isActive) {
            logger.info({ orgId, finalPlatform }, '[WEBHOOK FB] Bot is INACTIVE, skipping n8n');
            return null;
          }

          const targetUrl = n8nUrls[finalPlatform] || process.env.N8N_WEBHOOK_URL;
          if (!targetUrl) {
            logger.warn({ platform, mid }, '[WEBHOOK DEBUG] No N8N URL found for this platform or globally');
            return null;
          }

          const msgType = hasAttachments && event.message?.attachments?.[0]?.type === 'audio' ? 'audio' : 'text';

          logger.info({ targetUrl, finalPlatform, senderId }, '[WEBHOOK DEBUG] Forwarding to n8n...');
          const n8nRes = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              organizationId: orgId,
              platform: finalPlatform,
              message: messageText,
              text: messageText,
              type: msgType,
              senderId,
              username: finalUsername,
              name: finalName,
              hasAttachments,
              context,
              rawBody: body,
            }),
          });
          logger.info({ status: n8nRes.status, finalPlatform }, '[WEBHOOK DEBUG] n8n delivery status');
          return n8nRes;
        } catch (e) {
          logger.error('Messenger/IG forward error', e);
          return null;
        }
      })());
    }

    logger.info({ changesCount: changes.length }, '[WEBHOOK DEBUG] Processing Meta changes (WA/IG)');
    for (const change of changes) {
      const field = change.field;
      const value = change.value;

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

              const isLocation = msg.type === 'location';
              const text = isLocation
                ? `📍 الموقع الجغرافي تم إرساله (العرض: ${msg.location?.latitude}, الطول: ${msg.location?.longitude})`
                : (msg.text?.body || msg.caption || '');

              let msgType = 'text';
              if (msg.type === 'image') {
                msgType = 'image';
              } else if (msg.type === 'audio') {
                msgType = 'audio';
              } else if (isLocation) {
                msgType = 'location';
              }

              const conversation = await db.insert(conversationSchema)
                .values({
                  organizationId: orgId,
                  platform: 'whatsapp',
                  externalId: senderId,
                  customerName: senderName,
                  lastMessage: text,
                  lastMessageAt: new Date(),
                  isUnread: 'true',
                })
                .onConflictDoUpdate({
                  target: [conversationSchema.organizationId, conversationSchema.platform, conversationSchema.externalId],
                  set: {
                    lastMessage: text,
                    lastMessageAt: new Date(),
                    isUnread: 'true',
                  },
                })
                .returning();

              if (conversation[0]) {
                await db.insert(messageSchema).values({
                  organizationId: orgId,
                  conversationId: conversation[0].id,
                  direction: 'incoming',
                  senderType: 'customer',
                  text,
                  type: msgType,
                  metadata: mid,
                });
              }

              await notifyOrg(orgId, 'New WhatsApp message', `${senderName}: ${text}`, {
                conversationId: conversation[0]?.id,
                platform: 'whatsapp',
                externalId: senderId,
              });

              // --- AUTO-SEND WHATSAPP INTERACTIVE MENU ---
              const aiSettings = aiSettingsResults[0] as any;
              const menu = aiSettings?.whatsappMenu;
              const isGreeting = /^(?:سلام|مرحبا|هلا|hi|hello|start|menu|القائمة)$/i.test(text.trim());

              logger.info({ menuEnabled: menu?.enabled, isGreeting, text, hasIntegration: !!integration, providerId: integration?.providerId }, '[WEBHOOK DEBUG] Checking WhatsApp Menu Trigger');

              if (menu?.enabled && isGreeting && integration?.providerId && integration?.accessToken) {
                try {
                  const config = JSON.parse(integration.config || '{}');
                  const whatsappId = config.phoneNumberId || integration.providerId;
                  logger.info({ senderId, whatsappId }, '[WEBHOOK DEBUG] Sending WhatsApp Interactive Menu...');
                  await sendWhatsAppListMessage(
                    whatsappId,
                    senderId,
                    integration.accessToken,
                    {
                      header: menu.header,
                      body: menu.body,
                      footer: menu.footer,
                      buttonText: menu.buttonText,
                      sections: menu.sections,
                    },
                  );
                  logger.info({ orgId, senderId }, '[WEBHOOK] Auto-sent WhatsApp Interactive Menu');
                } catch (e) {
                  logger.error(e, '[WEBHOOK] Failed to auto-send WhatsApp Menu');
                }
              }

              // --- AUTO-SEND WHATSAPP QUICK BUTTONS ---
              const buttonsConfig = aiSettings?.whatsappButtons;
              const isButtonsTrigger = /^(?:أزرار|buttons|help|مساعدة|خيارات)$/i.test(text.trim());

              if (buttonsConfig?.enabled && isButtonsTrigger && integration?.providerId && integration?.accessToken) {
                try {
                  const config = JSON.parse(integration.config || '{}');
                  const whatsappId = config.phoneNumberId || integration.providerId;
                  logger.info({ senderId, whatsappId }, '[WEBHOOK DEBUG] Sending WhatsApp Quick Buttons...');
                  await sendWhatsAppButtonsMessage(
                    whatsappId,
                    senderId,
                    integration.accessToken,
                    {
                      header: buttonsConfig.header,
                      body: buttonsConfig.body,
                      footer: buttonsConfig.footer,
                      buttons: buttonsConfig.buttons,
                    },
                  );
                  logger.info({ orgId, senderId }, '[WEBHOOK] Auto-sent WhatsApp Quick Buttons');
                } catch (e) {
                  logger.error(e, '[WEBHOOK] Failed to auto-send WhatsApp Buttons');
                }
              }

              const isActive = (context.aiConfig as any).isActive !== 'false';
              if (!isActive) {
                logger.info({ orgId }, '[WEBHOOK] Bot WhatsApp messages are disabled, skipping n8n forward');
                return null;
              }

              const targetUrl = n8nUrls.whatsapp;
              if (!targetUrl) {
                return null;
              }

              return await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  organizationId: orgId,
                  platform: 'whatsapp',
                  message: text,
                  text,
                  type: msgType,
                  senderId,
                  name: senderName,
                  location: isLocation ? msg.location : undefined,
                  context,
                  rawBody: body,
                }),
              });
            } catch (e) {
              logger.error('WhatsApp forward error', e);
              return null;
            }
          })());
        }
      }

      if (field === 'comments' || field === 'mentions') {
        const commentId = value?.id || `CMT_${Date.now()}`;
        const parentId = value?.parent_id;
        const senderId = value?.from?.id as string;
        const senderName = value?.from?.username || value?.from?.name;
        const text = value?.text || value?.message || '';

        let igAccountId = null;
        try {
          const cfg = JSON.parse(integration.config || '{}');
          igAccountId = cfg.igAccountId;
        } catch {}

        if (senderId === integration.providerId || (igAccountId && senderId === igAccountId)) {
          logger.info({ senderId, providerId: integration.providerId, igAccountId }, '[WEBHOOK] processing self-comment (echo) as outgoing');

          processingPromises.push((async () => {
            const parentId = value?.parent_id;
            logger.info({ commentId, parentId }, '[WEBHOOK] Processing self-comment');

            if (parentId) {
              const exists = await db.query.webhookEventSchema.findFirst({
                where: eq(webhookEventSchema.mid, commentId),
              });
              if (exists) {
                logger.info({ commentId }, '[WEBHOOK] Echo already processed');
                return null;
              }
              await db.insert(webhookEventSchema).values({ mid: commentId });

              const originalComment = await db.query.messageSchema.findFirst({
                where: and(
                  eq(messageSchema.organizationId, orgId),
                  isNotNull(messageSchema.metadata),
                  sql`${messageSchema.metadata}::jsonb->>'commentId' = ${parentId}`,
                ),
              });

              if (originalComment) {
                logger.info({ conversationId: originalComment.conversationId }, '[WEBHOOK] Found original comment, saving reply');
                await db.insert(messageSchema).values({
                  organizationId: orgId,
                  conversationId: originalComment.conversationId,
                  direction: 'outgoing',
                  senderType: 'bot',
                  text,
                  type: 'text',
                  metadata: JSON.stringify({ commentId, parentId }),
                });
              } else {
                logger.warn({ parentId }, '[WEBHOOK] Original comment not found in DB for this parentId');
              }
            } else {
              logger.info('[WEBHOOK] Self-comment has no parentId (top-level bot comment)');
            }
            return null;
          })());
          continue;
        }

        processingPromises.push((async () => {
          try {
            const exists = await db.query.webhookEventSchema.findFirst({
              where: eq(webhookEventSchema.mid, commentId),
            });
            if (exists) {
              return null;
            }

            await db.insert(webhookEventSchema).values({ mid: commentId });

            if (senderId) {
              await upsertLead(orgId, senderId, 'instagram', senderName, senderName);
            }

            const conversation = await db.insert(conversationSchema)
              .values({
                organizationId: orgId,
                platform: 'instagram',
                externalId: senderId,
                lastMessage: text,
                lastMessageAt: new Date(),
                isUnread: 'true',
              })
              .onConflictDoUpdate({
                target: [conversationSchema.organizationId, conversationSchema.platform, conversationSchema.externalId],
                set: {
                  lastMessage: text,
                  lastMessageAt: new Date(),
                  isUnread: 'true',
                },
              })
              .returning();

            if (conversation[0]) {
              const mediaId = value?.media?.id;
              await db.insert(messageSchema).values({
                organizationId: orgId,
                conversationId: conversation[0].id,
                direction: 'incoming',
                senderType: 'customer',
                text,
                type: 'text',
                metadata: JSON.stringify({ commentId, mediaId, parentId }),
              });
            }

            await notifyOrg(orgId, 'New Instagram Comment', `${senderName}: ${text}`, {
              conversationId: conversation[0]?.id,
              platform: 'instagram',
              externalId: senderId,
            });

            const isCommentsActive = (context.aiConfig as any).isCommentsActive !== 'false';
            if (!isCommentsActive) {
              logger.info({ orgId }, '[WEBHOOK] Bot comments are disabled, skipping n8n forward');
              return null;
            }

            const targetUrl = n8nUrls.instagram;
            if (!targetUrl) {
              return null;
            }

            return await fetch(targetUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                organizationId: orgId,
                platform: 'instagram',
                eventType: field,
                message: text,
                text,
                commentId,
                senderId,
                username: senderName,
                context,
                rawBody: body,
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

  if (processingPromises.length > 0) {
    await Promise.all(processingPromises);
  }

  return true;
}
