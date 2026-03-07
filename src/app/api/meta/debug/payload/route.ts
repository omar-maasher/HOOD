import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { webhookEventSchema } from '@/models/Schema';

export const GET = async () => {
  try {
    // جلب آخر 10 رسائل وصلت من ميتا وتم تسجيلها في القاعدة
    const lastEvents = await db.select()
      .from(webhookEventSchema)
      .orderBy(desc(webhookEventSchema.createdAt))
      .limit(10);

    if (lastEvents.length === 0) {
      return NextResponse.json({
        status: 'waiting',
        message: 'No messages found in DB. Meta has NOT reached your server yet.',
        hint: 'Ensure you added your phone number to \'Recipient Phone Numbers\' in Meta Dashboard.',
      });
    }

    return NextResponse.json({
      status: 'success',
      received_count: lastEvents.length,
      latest_events: lastEvents,
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 });
  }
};
