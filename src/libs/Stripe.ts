import Stripe from 'stripe';

import { Env } from './Env';

// حماية الصفحة من الانهيار إذا كان المفتاح مفقوداً في Vercel
export const stripe = new Stripe(Env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
  typescript: true,
});
