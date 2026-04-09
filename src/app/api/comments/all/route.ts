import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { conversationSchema, messageSchema } from '@/models/Schema';

export const GET = async (_request: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const rows = await db
      .select({
        messageId: messageSchema.id,
        conversationId: messageSchema.conversationId,
        text: messageSchema.text,
        createdAt: messageSchema.createdAt,
        metadata: messageSchema.metadata,
        customerName: conversationSchema.customerName,
        externalId: conversationSchema.externalId,
        platform: conversationSchema.platform,
        isUnread: conversationSchema.isUnread,
      })
      .from(messageSchema)
      .innerJoin(conversationSchema, eq(messageSchema.conversationId, conversationSchema.id))
      .where(and(
        eq(messageSchema.organizationId, orgId),
        eq(conversationSchema.organizationId, orgId),
        eq(conversationSchema.platform, 'instagram'),
        eq(messageSchema.direction, 'incoming'),
        isNotNull(messageSchema.metadata),
      ))
      .orderBy(desc(messageSchema.createdAt));

    // Filter to only messages that have commentId (meaning they are comments, not just DMs)
    const filtered = rows.filter((r) => {
      try {
        const meta = JSON.parse(r.metadata || '{}');
        if (meta.commentId || meta.mediaId) {
          // Append extracted info directly
          return { ...r, metaMediaId: meta.mediaId, metaCommentId: meta.commentId };
        }
        return false;
      } catch {
        return false;
      }
    });

    const enriched = filtered.map((r) => {
      const meta = JSON.parse(r.metadata || '{}');
      return { ...r, metaMediaId: meta.mediaId, metaCommentId: meta.commentId };
    });

    return NextResponse.json({ items: enriched });
  } catch (error) {
    console.error('Failed to fetch all comments', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
