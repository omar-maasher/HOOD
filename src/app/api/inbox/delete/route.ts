import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { conversationSchema, messageSchema } from '@/models/Schema';

export const DELETE = async (request: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { messageId, conversationId } = await request.json();

    if (messageId) {
      // Delete specific message/comment
      await db.delete(messageSchema).where(
        and(
          eq(messageSchema.id, messageId),
          eq(messageSchema.organizationId, orgId),
        ),
      );
      return NextResponse.json({ success: true, mode: 'message' });
    }

    if (conversationId) {
      // Delete the entire conversation with all its messages
      await db.delete(conversationSchema).where(
        and(
          eq(conversationSchema.id, conversationId),
          eq(conversationSchema.organizationId, orgId),
        ),
      );
      return NextResponse.json({ success: true, mode: 'conversation' });
    }

    return new NextResponse('Missing messageId or conversationId', { status: 400 });
  } catch (error) {
    console.error('Delete error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
