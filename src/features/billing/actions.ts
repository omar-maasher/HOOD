'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Env } from '@/libs/Env';
import { stripe } from '@/libs/Stripe';

export const createCheckoutSession = async (priceId: string) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  if (!Env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured yet.');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${Env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
    cancel_url: `${Env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`,
    client_reference_id: orgId,
    subscription_data: {
      metadata: {
        orgId,
      },
    },
  });

  if (session.url) {
    redirect(session.url);
  }
};
