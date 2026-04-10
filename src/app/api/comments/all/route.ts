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
    // 3. Separate Roots from Replies
    const roots: any[] = [];
    const allMessages: any[] = [
      ...incomingRows.map(r => ({ ...r, direction: 'incoming' })),
      ...outgoingRows.map(o => ({ ...o, direction: 'outgoing' })),
    ];

    // Create a lookup for children by parentId
    const childrenByParent: Record<string, any[]> = {};
    const unlinkedOutgoing: Record<number, any[]> = {}; // by conversationId

    allMessages.forEach((m) => {
      try {
        const meta = JSON.parse(m.metadata || '{}');
        if (meta.parentId) {
          if (!childrenByParent[meta.parentId]) {
            childrenByParent[meta.parentId] = [];
          }
          childrenByParent[meta.parentId]?.push(m);
        } else if (m.direction === 'incoming' && (meta.commentId || meta.mediaId)) {
          // If it HAS a parentId, it's a reply (incoming), so don't show as root
          if (!meta.parentId) {
            roots.push(m);
          }
        } else if (m.direction === 'outgoing' && !meta.parentId) {
          // Fallback for bot replies that didn't get a parentId linked
          if (!unlinkedOutgoing[m.conversationId]) {
            unlinkedOutgoing[m.conversationId] = [];
          }
          unlinkedOutgoing[m.conversationId]?.push(m);
        }
      } catch {}
    });

    // Sort roots newest first
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const enriched = roots.map((root, index) => {
      const rootMeta = JSON.parse(root.metadata || '{}');
      const rootId = rootMeta.commentId;
      const thread: any[] = [];
      const visited = new Set();

      // Recursive/Stack-based collection of linked replies
      const stack = [rootId];
      while (stack.length > 0) {
        const pid = stack.pop();
        if (!pid || visited.has(pid)) {
          continue;
        }
        visited.add(pid);

        const children = childrenByParent[pid] || [];
        children.forEach((child) => {
          const childMeta = JSON.parse(child.metadata || '{}');
          thread.push({
            text: child.text,
            createdAt: child.createdAt,
            senderType: child.senderType || (child.direction === 'incoming' ? 'customer' : 'agent'),
            displayName: child.username || child.customerName || child.externalId,
          });
          if (childMeta.commentId) {
            stack.push(childMeta.commentId);
          }
        });
      }

      // FALLBACK: Add unlinked outgoing messages that happened shortly after this comment
      // but before the next root in the same conversation
      const nextRootInConv = roots.slice(0, index).reverse().find(next => next.conversationId === root.conversationId);
      const startTime = new Date(root.createdAt).getTime();
      const endTime = nextRootInConv ? new Date(nextRootInConv.createdAt).getTime() : Infinity;

      const extra = (unlinkedOutgoing[root.conversationId] || []).filter((m) => {
        const t = new Date(m.createdAt).getTime();
        return t >= startTime && t < endTime;
      });

      extra.forEach((m) => {
        thread.push({
          text: m.text,
          createdAt: m.createdAt,
          senderType: m.senderType || 'agent',
          displayName: m.username || m.customerName || m.externalId,
        });
      });

      // Final chronological sort
      thread.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // Deduplicate thread (in case of double matching)
      const uniqueThread = thread.filter((v, i, a) => a.findIndex(t => (t.text === v.text && t.createdAt === v.createdAt)) === i);

      return {
        ...root,
        displayName: root.username || root.customerName || root.externalId,
        metaMediaId: rootMeta.mediaId,
        metaCommentId: rootId,
        replies: uniqueThread,
        lastReply: uniqueThread[uniqueThread.length - 1] || null,
      };
    });

    return NextResponse.json({ items: enriched });
  } catch (error) {
    console.error('Failed to fetch all comments with replies', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
