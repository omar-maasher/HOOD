import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { webhookEventSchema } from '@/models/Schema';

export const GET = async () => {
  try {
    const lastEvents = await db.select()
      .from(webhookEventSchema)
      .orderBy(desc(webhookEventSchema.createdAt))
      .limit(15);

    return NextResponse.json({
      status: 'success',
      server_time: new Date().toISOString(),
      received_count: lastEvents.length,
      latest_events: lastEvents,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0', // منع التخزين المؤقت تماماً
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 });
  }
};
