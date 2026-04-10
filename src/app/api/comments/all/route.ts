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
    // 3. Combine and group messages into threads
    const allMessages = [
      ...incomingRows.map(r => ({ ...r, direction: 'incoming' })),
      ...outgoingRows.map(o => ({ ...o, direction: 'outgoing' })),
    ];

    const childrenByParent: Record<string, any[]> = {};
    const roots: any[] = [];

    allMessages.forEach((m: any) => {
      try {
        const meta = JSON.parse(m.metadata || '{}') as { parentId?: string; commentId?: string; mediaId?: string };
        if (meta.parentId) {
          if (!childrenByParent[meta.parentId]) {
            childrenByParent[meta.parentId] = [];
          }
          childrenByParent[meta.parentId]?.push(m);
        } else if (m.direction === 'incoming' && (meta.commentId || meta.mediaId)) {
          roots.push(m);
        }
      } catch {}
    });

    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const enriched = roots.map((root) => {
      const meta = JSON.parse(root.metadata || '{}');
      const rootId = meta.commentId;
      const thread: any[] = [];
      const stack = [rootId];
      const visited = new Set();

      while (stack.length > 0) {
        const pid = stack.pop();
        if (!pid || visited.has(pid)) {
          continue;
        }
        visited.add(pid);
        const children = (childrenByParent[pid] || []).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        children.forEach((child) => {
          thread.push({
            text: child.text,
            createdAt: child.createdAt,
            senderType: child.senderType || (child.direction === 'incoming' ? 'customer' : 'agent'),
            displayName: (child as any).username || (child as any).customerName || (child as any).externalId,
          });
          const childMeta = JSON.parse(child.metadata || '{}') as { commentId?: string };
          if (childMeta.commentId) {
            stack.push(childMeta.commentId);
          }
        });
      }

      thread.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return {
        ...root,
        displayName: root.username || root.customerName || root.externalId,
        metaMediaId: meta.mediaId,
        metaCommentId: meta.commentId,
        replies: thread,
        lastReply: thread[thread.length - 1] || null,
      };
    });

    return NextResponse.json({ items: enriched });
  } catch (error) {
    console.error('Failed to fetch all comments with replies', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
