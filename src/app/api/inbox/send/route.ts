import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import {
  sendInstagramMessage,
  sendMessengerMessage,
  sendWhatsAppMessage,
} from '@/libs/Meta';
import {
  conversationSchema,
  integrationSchema,
  messageSchema,
} from '@/models/Schema';

export const POST = async (request: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { conversationId, platform, externalId, text } = await request.json();

    if (!conversationId || !platform || !externalId || !text) {
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
    const providerId = integration.providerId; // WABA Phone ID or FB Page ID

    // 3. Send via Meta API
    let metaResponse: any;

    if (platform === 'whatsapp') {
      metaResponse = await sendWhatsAppMessage(providerId!, externalId, text, accessToken);
    } else if (platform === 'instagram') {
      metaResponse = await sendInstagramMessage(providerId!, externalId, text, accessToken);
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
      metadata: JSON.stringify(metaResponse),
    }).returning();

    // 5. Update Conversation last message
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
