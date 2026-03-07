import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { webhookEventSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const isPing = searchParams.get('ping') === 'true';

  if (isPing) {
    const rawId = `SELF_TEST_${Date.now()}`;
    try {
      await db.insert(webhookEventSchema).values({ mid: rawId });
      return NextResponse.json({ status: 'success', message: 'Self-test entry created!' });
    } catch (e) {
      return NextResponse.json({ status: 'error', error: String(e) });
    }
  }

  try {
    const lastEvents = await db.select()
      .from(webhookEventSchema)
      .orderBy(desc(webhookEventSchema.createdAt))
      .limit(15);

    const token = process.env.META_VERIFY_TOKEN || '';

    return NextResponse.json({
      status: 'success',
      server_time: new Date().toISOString(),
      // كشف حالة التوكن للتأكد من وجوده في السيرفر
      env_check: {
        is_verify_token_set: !!token,
        verify_token_preview: token ? `${token.substring(0, 3)}***` : 'NOT_DEFINED',
        is_n8n_url_set: !!process.env.N8N_WEBHOOK_URL,
      },
      received_count: lastEvents.length,
      latest_events: lastEvents,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 });
  }
};
