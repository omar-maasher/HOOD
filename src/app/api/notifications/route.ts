import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { notificationSchema } from '@/models/Schema';

export async function GET() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await db.query.notificationSchema.findMany({
      where: eq(notificationSchema.organizationId, orgId),
      orderBy: [desc(notificationSchema.createdAt)],
      limit: 20,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, markAllRead } = await req.json();

    if (markAllRead) {
      await db.update(notificationSchema)
        .set({ isRead: 'true' })
        .where(eq(notificationSchema.organizationId, orgId));
    } else if (id) {
      await db.update(notificationSchema)
        .set({ isRead: 'true' })
        .where(eq(notificationSchema.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
