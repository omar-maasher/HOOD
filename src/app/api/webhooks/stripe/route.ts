import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { db } from '@/libs/DB';
import { stripe } from '@/libs/Stripe';
import { organizationSchema } from '@/models/Schema';
import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

import { processStripeWebhookPayload } from './processor';

export const POST = async (request: Request) => {
  const body = await request.text();
  const sig = (await headers()).get('Stripe-Signature');

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) {
      console.error('❌ Webhook Secret or Signature missing');
      return new NextResponse('Webhook Secret not found', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`✅ Received Stripe event: ${event.type}`);

  if (process.env.QSTASH_TOKEN && process.env.NEXT_PUBLIC_APP_URL) {
    const { enqueueTask } = await import('@/libs/Queue');
    await enqueueTask(`${process.env.NEXT_PUBLIC_APP_URL}/api/queue/worker`, {
      taskType: 'process_stripe_webhook',
      data: event,
    });
    return new NextResponse('OK', { status: 200 });
  }

  await processStripeWebhookPayload(event);
  return new NextResponse('OK', { status: 200 });
};
