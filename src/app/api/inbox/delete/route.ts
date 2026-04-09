import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { conversationSchema } from '@/models/Schema';

export const DELETE = async (request: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { conversationId } = await request.json();

    if (!conversationId) {
      return new NextResponse('Missing conversationId', { status: 400 });
    }

    // Delete the conversation. Messages will be deleted via cascade
    await db.delete(conversationSchema).where(
      and(
        eq(conversationSchema.id, conversationId),
        eq(conversationSchema.organizationId, orgId),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
