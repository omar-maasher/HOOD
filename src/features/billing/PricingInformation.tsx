import { PricingCard } from '@/features/billing/PricingCard';
import { PricingFeature } from '@/features/billing/PricingFeature';
import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

const planFeatures: Record<string, string[]> = {
  [PLAN_ID.FREE]: [
    '3 قنوات (واتساب، انستقرام، ماسنجر)',
    '150 محادثة',
    '300 رسالة AI',
    '1 حملة (حتى 150 مستلم)',
    'CRM حتى 200 عميل',
    'نظام حجوزات مفعّل',
  ],
  [PLAN_ID.PREMIUM]: [
    '3 قنوات',
    '2,000 محادثة',
    '2,000 رسالة AI',
    '2 حملات (حتى 2,000 مستلم)',
    'CRM حتى 5,000 عميل',
    'تقارير متقدمة',
    'أتمتة أساسية',
  ],
  [PLAN_ID.ENTERPRISE]: [
    '3 قنوات',
    '7,000 محادثة',
    '7,000 رسالة AI',
    '5 حملات (حتى 7,000 مستلم)',
    'CRM غير محدود',
    'أتمتة متقدمة',
    'Webhooks',
    'تقارير احترافية',
  ],
};

export const PricingInformation = (props: {
  buttonList: Record<string, React.ReactNode>;
}) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
      {Object.values(PricingPlanList).map(plan => (
        <PricingCard
          key={plan.id}
          planId={plan.id}
          price={plan.price}
          interval={plan.interval}
          button={props.buttonList[plan.id]}
        >
          {planFeatures[plan.id]?.map(feature => (
            <PricingFeature key={feature}>
              {feature}
            </PricingFeature>
          ))}
        </PricingCard>
      ))}
    </div>
  );
};
