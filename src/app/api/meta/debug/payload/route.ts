import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { webhookEventSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const isPing = searchParams.get('ping') === 'true';

  // إذا طلب المستخدم عمل "Ping" تجريبي
  if (isPing) {
    const rawId = `SELF_TEST_${Date.now()}`;
    try {
      await db.insert(webhookEventSchema).values({ mid: rawId });
      return NextResponse.json({ status: 'success', message: 'Self-test entry created in DB!', mid: rawId });
    } catch (e) {
      return NextResponse.json({ status: 'error', message: 'Failed to write to DB', error: String(e) });
    }
  }

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
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 });
  }
};
