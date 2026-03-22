import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { conversationSchema, messageSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { orgId } = await auth();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (!conversationId) {
    return new NextResponse('Missing conversationId', { status: 400 });
  }

  try {
    // 1. Verify access to this conversation
    const conv = await db.query.conversationSchema.findFirst({
      where: and(
        eq(conversationSchema.id, Number.parseInt(conversationId)),
        eq(conversationSchema.organizationId, orgId),
      ),
    });

    if (!conv) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    // 2. Fetch messages ordered by creation date
    const messages = await db.query.messageSchema.findMany({
      where: eq(messageSchema.conversationId, Number.parseInt(conversationId)),
      orderBy: (msg, { asc }) => [asc(msg.createdAt)],
    });

    // 3. Mark conversation as read
    if (conv.isUnread === 'true') {
      await db.update(conversationSchema)
        .set({ isUnread: 'false' })
        .where(eq(conversationSchema.id, Number.parseInt(conversationId)));
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
