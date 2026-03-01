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

  if (!n8nWebhookUrl) {
    return new NextResponse('OK', { status: 200 });
  }

  // Use a pool of promises to process everything in parallel
  const processingPromises = entries.flatMap((entry: any) => {
    const pageId = entry.id;
    const messaging = entry.messaging || [];
    const changes = entry.changes || [];

    const messagingPromises = messaging.map(async (messagingEvent: any) => {
      if (
        messagingEvent.message?.is_echo
        || messagingEvent.sender?.id === pageId
        || messagingEvent.delivery
        || messagingEvent.read
      ) {
        return;
      }

      try {
        const platform = body.object === 'page' ? 'messenger' : (body.object === 'instagram' ? 'instagram' : 'unknown');
        const enrichedPayload: any = {
          rawBody: { ...body, entry: [entry] },
          platform,
        };

        const integration = await db.query.integrationSchema.findFirst({
          where: eq(integrationSchema.providerId, pageId),
        });

        if (integration) {
          const aiSettings = await db.query.aiSettingsSchema.findFirst({
            where: eq(aiSettingsSchema.organizationId, integration.organizationId),
          });

          enrichedPayload.context = {
            organizationId: integration.organizationId,
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
        console.error('Messaging processing error:', error);
      }
    });

    const changesPromises = changes.map(async (change: any) => {
      const waValue = change.value;
      if (waValue?.statuses || !waValue?.messages) {
        return;
      }

      try {
        const enrichedPayload: any = {
          rawBody: { ...body, entry: [entry] },
          platform: 'whatsapp',
        };

        const integration = await db.query.integrationSchema.findFirst({
          where: eq(integrationSchema.providerId, pageId),
        });

        if (integration) {
          const aiSettings = await db.query.aiSettingsSchema.findFirst({
            where: eq(aiSettingsSchema.organizationId, integration.organizationId),
          });

          enrichedPayload.context = {
            organizationId: integration.organizationId,
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
        console.error('WhatsApp processing error:', error);
      }
    });

    return [...messagingPromises, ...changesPromises];
  });

  // Await everything at once
  await Promise.all(processingPromises);

  // Acknowledge receipt to Meta
  return new NextResponse('OK', { status: 200 });
};
