import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { conversationSchema, leadSchema, messageSchema } from '@/models/Schema';

export const GET = async (_request: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch all incoming messages for Instagram that have metadata (likely comments)
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
        username: leadSchema.username,
      })
      .from(messageSchema)
      .innerJoin(conversationSchema, eq(messageSchema.conversationId, conversationSchema.id))
      .leftJoin(leadSchema, and(
        eq(leadSchema.externalId, conversationSchema.externalId),
        eq(leadSchema.organizationId, orgId),
      ))
      .where(and(
        eq(messageSchema.organizationId, orgId),
        eq(conversationSchema.organizationId, orgId),
        eq(conversationSchema.platform, 'instagram'),
        eq(messageSchema.direction, 'incoming'),
        isNotNull(messageSchema.metadata),
      ))
      .orderBy(desc(messageSchema.createdAt));

    // 2. Fetch all outgoing replies for the same org
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

    // Filter incoming to only those that are actually comments
    const filtered = incomingRows.filter((r) => {
      try {
        const meta = JSON.parse(r.metadata || '{}');
        return !!(meta.commentId || meta.mediaId);
      } catch {
        return false;
      }
    });

    const enriched = filtered.map((r, index) => {
      const meta = JSON.parse(r.metadata || '{}');
      const convReplies = outgoingByConv[r.conversationId] || [];

      // Find the next incoming comment in the same conversation if it exists
      const nextIncomingInConv = filtered.slice(0, index).reverse().find(next => next.conversationId === r.conversationId);

      // Filter outgoing messages that belong to this comment thread
      // For now, any outgoing message in the same conversation that is AFTER this comment
      // and BEFORE the next incoming comment is considered a reply.
      const replies = convReplies.filter((rep) => {
        const repTime = new Date(rep.createdAt).getTime();
        const rTime = new Date(r.createdAt).getTime();
        const nextTime = nextIncomingInConv ? new Date(nextIncomingInConv.createdAt).getTime() : Infinity;
        return repTime >= rTime && repTime < nextTime;
      }).reverse(); // Reverse back to CHRONOLOGICAL within the thread

      return {
        ...r,
        displayName: r.username || r.customerName || r.externalId,
        metaMediaId: meta.mediaId,
        metaCommentId: meta.commentId,
        replies: replies.map(rep => ({
          text: rep.text,
          createdAt: rep.createdAt,
          senderType: rep.senderType,
        })),
        lastReply: replies[replies.length - 1] || null, // For backward compatibility
      };
    });

    return NextResponse.json({ items: enriched });
  } catch (error) {
    console.error('Failed to fetch all comments with replies', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
