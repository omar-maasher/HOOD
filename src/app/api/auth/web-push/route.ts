import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';

export async function POST(req: Request) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscription } = await req.json();

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription is required' }, { status: 400 });
    }

    const org = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, orgId),
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const currentSubs = org.webPushSubscriptions || [];

    // Check if subscription already exists by checking endpoint
    const exists = currentSubs.find(s => s.endpoint === subscription.endpoint);

    if (!exists) {
      const newSubs = [...currentSubs, subscription];
      await db.update(organizationSchema)
        .set({ webPushSubscriptions: newSubs })
        .where(eq(organizationSchema.id, orgId));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving web push subscription:', error);
    return NextResponse.json({ error: 'Failed to save web push subscription' }, { status: 500 });
  }
}
