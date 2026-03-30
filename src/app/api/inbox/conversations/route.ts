import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { conversationSchema } from '@/models/Schema';

export async function GET() {
  const { orgId } = await auth();

  if (!orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversations = await db.query.conversationSchema.findMany({
    where: eq(conversationSchema.organizationId, orgId),
    orderBy: (conv, { desc }) => [desc(conv.lastMessageAt)],
  });

  return NextResponse.json(conversations);
}

export const dynamic = 'force-dynamic';
