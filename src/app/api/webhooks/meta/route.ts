import { NextResponse } from 'next/server';

import { logger } from '@/libs/Logger';

import { processMetaWebhookPayload } from './processor';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
};

export const POST = async (request: Request) => {
  const body = await request.json();

  // Print raw webhook to Vercel logs to verify Meta is sending data
  logger.info({ webhookBody: body }, 'Incoming Meta Webhook');

  if (process.env.QSTASH_TOKEN && process.env.NEXT_PUBLIC_APP_URL) {
    // 1. Queue the task for background processing
    const { enqueueTask } = await import('@/libs/Queue');
    await enqueueTask(`${process.env.NEXT_PUBLIC_APP_URL}/api/queue/worker`, {
      taskType: 'process_meta_webhook',
      data: body,
    });
    // Return 200 OK immediately to Meta
    return new NextResponse('OK', { status: 200 });
  }

  // Fallback: Synchronous processing
  await processMetaWebhookPayload(body);
  return new NextResponse('OK', { status: 200 });
};
