import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { integrationSchema, aiSettingsSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';

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

  console.log('Received Meta Webhook:', JSON.stringify(body, null, 2));

  let pageId = null;
  let platform = 'unknown';

  // Extract Page ID / WABA ID depending on the object type
  if (body.object === 'page') {
    pageId = body.entry?.[0]?.id; // Instagram/Messenger Page ID
    platform = 'instagram';
  } else if (body.object === 'whatsapp_business_account') {
    pageId = body.entry?.[0]?.id; // WhatsApp WABA ID
    platform = 'whatsapp';
  }

  // Forward to n8n Flow
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (n8nWebhookUrl) {
    try {
      // Background async processing: Don't await so Meta gets 200 OK fast
      (async () => {
        let enrichedPayload: any = { rawBody: body, platform };

        if (pageId) {
          // Find the tenant (Organization) that owns this Instagram/WhatsApp account
          const integration = await db.query.integrationSchema.findFirst({
            where: eq(integrationSchema.providerId, pageId),
          });

          if (integration) {
            const orgId = integration.organizationId;
            // Fetch AI Settings for this organization
            const aiSettings = await db.query.aiSettingsSchema.findFirst({
              where: eq(aiSettingsSchema.organizationId, orgId),
            });

            // Attach context so n8n doesn't have to hit DB
            enrichedPayload = {
              ...enrichedPayload,
              context: {
                organizationId: orgId,
                integrationType: integration.type,
                aiConfig: aiSettings || { isActive: 'false' }, // Fallback if no settings
              }
            };
          } else {
            console.log(`No active integration found for provider id: ${pageId}`);
          }
        }

        console.log('Forwarding Enriched Payload to n8n...');
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enrichedPayload),
        });
      })().catch(err => console.error('Error forwarding to n8n:', err));
      
    } catch (error) {
      console.error('Error initiating forward to n8n:', error);
    }
  } else {
    console.log('No N8N_WEBHOOK_URL configured, skipping forward.');
  }

  // Acknowledge receipt to Meta immediately (Required by Meta within 20 seconds)
  return new NextResponse('OK', { status: 200 });
};
