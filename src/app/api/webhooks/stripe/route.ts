import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { stripe } from '@/libs/Stripe';
import { organizationSchema } from '@/models/Schema';
import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.client_reference_id;
      const subscriptionId = session.subscription as string;

      console.log(`🔍 Processing session for Org: ${orgId}, Subscription: ${subscriptionId}`);

      if (orgId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;

          let planId = PLAN_ID.FREE;
          for (const [key, plan] of Object.entries(PricingPlanList)) {
            if (plan.devPriceId === priceId || plan.prodPriceId === priceId || plan.testPriceId === priceId) {
              planId = key as any;
              break;
            }
          }

          console.log(`📝 Updating DB for Org ${orgId} to Plan ${planId} with Status ${subscription.status}`);

          await db.update(organizationSchema)
            .set({
              stripeSubscriptionId: subscriptionId,
              stripeSubscriptionPriceId: priceId,
              stripeSubscriptionStatus: subscription.status,
              stripeSubscriptionCurrentPeriodEnd: subscription.current_period_end,
              planId,
            })
            .where(eq(organizationSchema.id, orgId));

          console.log(`✨ Successfully activated account for Org ${orgId}`);
        } catch (dbError) {
          console.error(`❌ Database Update Error:`, dbError);
        }
      } else {
        console.warn('⚠️ No orgId found in session client_reference_id');
      }
      break;
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const orgId = subscription.metadata.orgId;

      console.log(`🔄 Subscription update/delete for Org: ${orgId}, Status: ${subscription.status}`);

      if (orgId) {
        const priceId = subscription.items.data[0]?.price.id;
        let planId = PLAN_ID.FREE;
        for (const [key, plan] of Object.entries(PricingPlanList)) {
          if (plan.devPriceId === priceId || plan.prodPriceId === priceId || plan.testPriceId === priceId) {
            planId = key as any;
            break;
          }
        }

        await db.update(organizationSchema)
          .set({
            stripeSubscriptionStatus: subscription.status,
            stripeSubscriptionCurrentPeriodEnd: subscription.current_period_end,
            planId: subscription.status === 'active' ? planId : PLAN_ID.FREE,
          })
          .where(eq(organizationSchema.id, orgId));
      }
      break;
    }
  }

  return new NextResponse('OK', { status: 200 });
};
