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
    // 1. Fetch all incoming comments
    const incomingRows = await db
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

    // 2. Fetch all outgoing replies for the same org (to avoid per-row subqueries in JS loop)
    const outgoingRows = await db
      .select({
        id: messageSchema.id,
        conversationId: messageSchema.conversationId,
        text: messageSchema.text,
        createdAt: messageSchema.createdAt,
        senderType: messageSchema.senderType,
      })
      .from(messageSchema)
      .where(and(
        eq(messageSchema.organizationId, orgId),
        eq(messageSchema.direction, 'outgoing'),
      ))
      .orderBy(desc(messageSchema.createdAt));

    // Group outgoing by conversation for faster lookup
    const outgoingByConv: Record<number, any[]> = {};
    outgoingRows.forEach((row) => {
      if (!outgoingByConv[row.conversationId]) {
        outgoingByConv[row.conversationId] = [];
      }
      outgoingByConv[row.conversationId]!.push(row);
    });

    // Filter incoming to only those that are actually comments (have commentId in JSON metadata)
    const filtered = incomingRows.filter((r) => {
      try {
        const meta = JSON.parse(r.metadata || '{}');
        if (meta.commentId || meta.mediaId) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    });

    const enriched = filtered.map((r) => {
      const meta = JSON.parse(r.metadata || '{}');

      // Find the latest reply in this conversation that happened AFTER this comment
      // (Simplified: we assume a reply in the same conv after the comment is related)
      const convReplies = outgoingByConv[r.conversationId] || [];
      const latestReply = convReplies.find(rep =>
        new Date(rep.createdAt) >= new Date(r.createdAt),
      );

      return {
        ...r,
        metaMediaId: meta.mediaId,
        metaCommentId: meta.commentId,
        lastReply: latestReply
          ? {
              text: latestReply.text,
              createdAt: latestReply.createdAt,
              senderType: latestReply.senderType,
            }
          : null,
      };
    });

    return NextResponse.json({ items: enriched });
  } catch (error) {
    console.error('Failed to fetch all comments with replies', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
