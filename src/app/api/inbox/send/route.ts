import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import {
  replyToInstagramComment,
  sendInstagramMessage,
  sendMessengerMessage,
  sendWhatsAppMessage,
} from '@/libs/Meta';
import {
  conversationSchema,
  integrationSchema,
  messageSchema,
  webhookEventSchema,
} from '@/models/Schema';

export const POST = async (request: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { conversationId, platform, externalId, text, commentId } = await request.json();

    // externalId is optional if replying to an Instagram comment via commentId
    if (!conversationId || !platform || !text || (!externalId && !commentId)) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 1. Verify and Load Conversation
    const conv = await db.query.conversationSchema.findFirst({
      where: and(
        eq(conversationSchema.id, conversationId),
        eq(conversationSchema.organizationId, orgId),
      ),
    });

    if (!conv) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    // 2. Load the relevant Integration for token and provider ID
    const integration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, platform === 'whatsapp' ? 'whatsapp' : (platform === 'messenger' ? 'messenger' : 'instagram')),
      ),
    });

    if (!integration || !integration.accessToken) {
      return NextResponse.json({ error: 'Platform not connected' }, { status: 400 });
    }

    const accessToken = integration.accessToken;
    let providerId = integration.providerId; // FB Page ID
    let isDirectLogin = false;

    // For WhatsApp, we need the phoneNumberId from config, not the WABA ID
    if (platform === 'whatsapp' && integration.config) {
      try {
        const config = JSON.parse(integration.config);
        if (config.phoneNumberId) {
          providerId = config.phoneNumberId;
        }
      } catch (e) {
        console.error('Failed to parse integration config', e);
      }
    }

    if (platform === 'instagram' && integration.config) {
      try {
        const config = JSON.parse(integration.config);
        if (config.method === 'instagram_direct') {
          isDirectLogin = true;
        }
      } catch {
        // ignore
      }
    }

    // 3. Send via Meta API
    let metaResponse: any;

    if (platform === 'whatsapp') {
      metaResponse = await sendWhatsAppMessage(providerId!, externalId, text, accessToken);
    } else if (platform === 'instagram') {
      if (commentId) {
        metaResponse = await replyToInstagramComment(commentId, text, accessToken, isDirectLogin);
      } else {
        metaResponse = await sendInstagramMessage(providerId!, externalId, text, accessToken, isDirectLogin);
      }
    } else if (platform === 'messenger') {
      metaResponse = await sendMessengerMessage(providerId!, externalId, text, accessToken);
    }

    // 4. Record the outgoing message in DB
    const [newMessage] = await db.insert(messageSchema).values({
      organizationId: orgId,
      conversationId: conv.id,
      direction: 'outgoing',
      text,
      type: 'text',
      senderType: 'agent',
      metadata: JSON.stringify(metaResponse),
    }).returning();

    // 5. Deduplication: Register the MID so the webhook echo doesn't duplicate it
    const metaId = platform === 'whatsapp' ? metaResponse.messages?.[0]?.id : (metaResponse.message_id || metaResponse.id);
    if (metaId) {
      await db.insert(webhookEventSchema).values({ mid: metaId }).onConflictDoNothing();
    }

    // 6. Update Conversation last message
    await db.update(conversationSchema)
      .set({
        lastMessage: text,
        lastMessageAt: new Date(),
        isUnread: 'false',
      })
      .where(eq(conversationSchema.id, conv.id));

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
};
