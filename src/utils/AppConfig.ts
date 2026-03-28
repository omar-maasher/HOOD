import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

import { BILLING_INTERVAL, type PricingPlan } from '@/types/Subscription';

const localePrefix: LocalePrefix = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'hoodtrading',
  locales: [
    { id: 'ar', name: 'العربية' },
    { id: 'en', name: 'English' },
  ],
  defaultLocale: 'ar',
  localePrefix,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);

export const PLAN_ID = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const PricingPlanList: Record<string, PricingPlan> = {
  [PLAN_ID.FREE]: {
    id: PLAN_ID.FREE,
    price: 35,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_1TFz0TKCGBuLPgjQTFcojlxv',
    devPriceId: 'price_1TFz0TKCGBuLPgjQTFcojlxv',
    prodPriceId: 'price_1TFz0TKCGBuLPgjQTFcojlxv',
    features: {
      teamMember: 2,
      website: 2,
      storage: 2,
      transfer: 2,
    },
  },
  [PLAN_ID.PREMIUM]: {
    id: PLAN_ID.PREMIUM,
    price: 50,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_1TFyUaKCGBuLPgjQsd9R1dLD',
    devPriceId: 'price_1TFyUaKCGBuLPgjQsd9R1dLD',
    prodPriceId: 'price_1TFyUaKCGBuLPgjQsd9R1dLD',
    features: {
      teamMember: 5,
      website: 5,
      storage: 5,
      transfer: 5,
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 69,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_1TFyXDKCGBuLPgjQRuh1heUT',
    devPriceId: 'price_1TFyXDKCGBuLPgjQRuh1heUT',
    prodPriceId: 'price_1TFyXDKCGBuLPgjQRuh1heUT',
    features: {
      teamMember: 100,
      website: 100,
      storage: 100,
      transfer: 100,
    },
  },
};
