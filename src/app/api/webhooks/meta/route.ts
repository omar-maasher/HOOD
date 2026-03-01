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

export const POST = async (request: Request) => {
  const body = await request.json();

  // eslint-disable-next-line no-console
  console.log('Received Meta Webhook:', JSON.stringify(body, null, 2));

  const entries = body.entry || [];
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  // Process all entries and messaging events
  for (const entry of entries) {
    const pageId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    // --- 1. HANDLE MESSAGING (Instagram/Messenger) ---
    for (const messagingEvent of messaging) {
      // Filter out echoes and system events
      if (
        messagingEvent.message?.is_echo
        || messagingEvent.sender?.id === pageId
        || messagingEvent.delivery
        || messagingEvent.read
      ) {
        continue;
      }

      if (n8nWebhookUrl) {
        try {
          const platform = body.object === 'page' ? 'messenger' : (body.object === 'instagram' ? 'instagram' : 'unknown');

          const enrichedPayload: any = {
            rawBody: { ...body, entry: [entry] },
            platform,
          };

          // Find the organization
          const integration = await db.query.integrationSchema.findFirst({
            where: eq(integrationSchema.providerId, pageId),
          });

          if (integration) {
            const orgId = integration.organizationId;
            const aiSettings = await db.query.aiSettingsSchema.findFirst({
              where: eq(aiSettingsSchema.organizationId, orgId),
            });

            enrichedPayload.context = {
              organizationId: orgId,
              integrationType: integration.type,
              aiConfig: aiSettings || { isActive: 'false' },
            };
          }

          // Forward to n8n
          await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedPayload),
          });
        } catch (error) {
          console.error('Error forwarding to n8n:', error);
        }
      }
    }

    // --- 2. HANDLE CHANGES (WhatsApp/Others) ---
    for (const change of changes) {
      const waValue = change.value;

      // Filter WhatsApp status updates
      if (waValue?.statuses) {
        continue;
      }

      if (n8nWebhookUrl && waValue?.messages) {
        try {
          const enrichedPayload: any = {
            rawBody: { ...body, entry: [entry] },
            platform: 'whatsapp',
          };

          // Find organization by WABA ID (pageId)
          const integration = await db.query.integrationSchema.findFirst({
            where: eq(integrationSchema.providerId, pageId),
          });

          if (integration) {
            const orgId = integration.organizationId;
            const aiSettings = await db.query.aiSettingsSchema.findFirst({
              where: eq(aiSettingsSchema.organizationId, orgId),
            });

            enrichedPayload.context = {
              organizationId: orgId,
              integrationType: integration.type,
              aiConfig: aiSettings || { isActive: 'false' },
            };
          }

          await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedPayload),
          });
        } catch (error) {
          console.error('Error forwarding WhatsApp to n8n:', error);
        }
      }
    }
  }

  // Acknowledge receipt to Meta
  return new NextResponse('OK', { status: 200 });
};
