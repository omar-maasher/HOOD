import { Bot, Building2, CalendarCheck, Check, Crown, Megaphone, MessageSquare, Radio, ShieldCheck, Users, Zap } from 'lucide-react';
import { getLocale } from 'next-intl/server';

import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

export default async function SubscriptionPage() {
  const locale = await getLocale();
  const isAr = locale === 'ar';

  let currentPlanId: string = PLAN_ID.FREE;
  let subscriptionStatus = isAr ? 'حساب أساسي' : 'Basic Account';

  try {
    const { auth } = await import('@clerk/nextjs/server');
    const { eq } = await import('drizzle-orm');
    const { db } = await import('@/libs/DB');
    const { organizationSchema } = await import('@/models/Schema');

    const { orgId } = await auth();

    if (orgId && db) {
      const orgData = await db.query.organizationSchema.findFirst({
        where: eq(organizationSchema.id, orgId),
      });

      if (orgData?.stripeSubscriptionPriceId) {
        const priceId = orgData.stripeSubscriptionPriceId;
        const premiumPriceIds = [PricingPlanList.premium?.devPriceId, PricingPlanList.premium?.prodPriceId, PricingPlanList.premium?.testPriceId];
        const enterprisePriceIds = [PricingPlanList.enterprise?.devPriceId, PricingPlanList.enterprise?.prodPriceId, PricingPlanList.enterprise?.testPriceId];

        if (premiumPriceIds.includes(priceId)) {
          currentPlanId = PLAN_ID.PREMIUM;
        } else if (enterprisePriceIds.includes(priceId)) {
          currentPlanId = PLAN_ID.ENTERPRISE;
        }

        if (orgData.stripeSubscriptionStatus === 'active') {
          subscriptionStatus = isAr ? 'نشط' : 'Active';
        } else if (orgData.stripeSubscriptionStatus === 'trialing') {
          subscriptionStatus = isAr ? 'فترة تجريبية' : 'Trial';
        } else {
          subscriptionStatus = orgData.stripeSubscriptionStatus || (isAr ? 'غير نشط' : 'Inactive');
        }
      }
    }
  } catch (error) {
    console.error('Subscription page error:', error);
  }

  const plans = [
    {
      id: PLAN_ID.FREE,
      name: isAr ? 'Trial – 7 أيام' : 'Trial – 7 Days',
      price: 0,
      description: isAr ? 'جرّب النظام مجاناً لمدة 7 أيام بدون التزام' : 'Try the system for free for 7 days without commitment',
      icon: Building2,
      color: 'gray',
      trial: true,
      features: [
        { icon: Radio, text: isAr ? '3 قنوات (واتساب، انستقرام، ماسنجر)' : '3 Channels (WhatsApp, Instagram, Messenger)' },
        { icon: MessageSquare, text: isAr ? '150 محادثة' : '150 Conversations' },
        { icon: Bot, text: isAr ? '300 رسالة AI' : '300 AI Messages' },
        { icon: Megaphone, text: isAr ? '1 حملة (حتى 150 مستلم)' : '1 Campaign (up to 150 recipients)' },
        { icon: Users, text: isAr ? 'CRM حتى 200 عميل' : 'CRM up to 200 customers' },
        { icon: CalendarCheck, text: isAr ? 'نظام حجوزات مفعّل' : 'Active Booking System' },
      ],
    },
    {
      id: PLAN_ID.PREMIUM,
      name: isAr ? 'باقة بريميوم' : 'Premium Plan',
      price: 39,
      description: isAr ? 'مناسبة لمتجر متوسط' : 'Suitable for a medium store',
      icon: Crown,
      color: 'indigo',
      popular: true,
      features: [
        { icon: Radio, text: isAr ? '3 قنوات' : '3 Channels' },
        { icon: MessageSquare, text: isAr ? '2,000 محادثة' : '2,000 Conversations' },
        { icon: Bot, text: isAr ? '2,000 رسالة AI' : '2,000 AI Messages' },
        { icon: Megaphone, text: isAr ? '2 حملات (حتى 2,000 مستلم)' : '2 Campaigns (up to 2,000 recipients)' },
        { icon: Users, text: isAr ? 'CRM حتى 5,000 عميل' : 'CRM up to 5,000 customers' },
        { icon: CalendarCheck, text: isAr ? 'تقارير متقدمة' : 'Advanced Reports' },
        { icon: Zap, text: isAr ? 'أتمتة أساسية' : 'Basic Automation' },
      ],
    },
    {
      id: PLAN_ID.ENTERPRISE,
      name: isAr ? 'باقة الشركات' : 'Enterprise Plan',
      price: 69,
      description: isAr ? 'للشركات والمؤسسات الكبرى' : 'For large companies and enterprises',
      icon: ShieldCheck,
      color: 'purple',
      features: [
        { icon: Radio, text: isAr ? '3 قنوات' : '3 Channels' },
        { icon: MessageSquare, text: isAr ? '7,000 محادثة' : '7,000 Conversations' },
        { icon: Bot, text: isAr ? '7,000 رسالة AI' : '7,000 AI Messages' },
        { icon: Megaphone, text: isAr ? '5 حملات (حتى 7,000 مستلم)' : '5 Campaigns (up to 7,000 recipients)' },
        { icon: Users, text: isAr ? 'CRM غير محدود' : 'Unlimited CRM' },
        { icon: Zap, text: isAr ? 'أتمتة متقدمة' : 'Advanced Automation' },
        { icon: Radio, text: 'Webhooks' },
        { icon: CalendarCheck, text: isAr ? 'تقارير احترافية' : 'Professional Reports' },
      ],
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-start">
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {isAr ? 'الاشتراك والباقات' : 'Subscription & Plans'}
          </h1>
          <p className="mt-1 text-base font-medium text-muted-foreground">
            {isAr ? 'اختر الباقة المناسبة لنشاطك التجاري.' : 'Choose the right plan for your business.'}
          </p>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div className={`relative flex flex-col items-center justify-between gap-5 overflow-hidden rounded-[2rem] border p-6 shadow-sm md:flex-row md:p-8 ${currentPlanId !== PLAN_ID.FREE
        ? 'border-indigo-100/40 bg-gradient-to-r from-indigo-50/80 to-purple-50/80'
        : 'border-border/30 bg-muted/10'
      }`}
      >
        <div className="flex items-center gap-4 text-start">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${currentPlanId !== PLAN_ID.FREE ? 'bg-indigo-100/80 text-indigo-600' : 'bg-primary/10 text-primary'
          }`}
          >
            {currentPlanId !== PLAN_ID.FREE ? <Crown className="size-6" /> : <Building2 className="size-6" />}
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-3">
              <h3 className={`text-lg font-bold ${currentPlanId !== PLAN_ID.FREE ? 'text-indigo-900' : 'text-gray-900'}`}>
                {isAr ? 'باقتك الحالية:' : 'Your Current Plan:'}
                {' '}
                {plans.find(p => p.id === currentPlanId)?.name}
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${subscriptionStatus === (isAr ? 'نشط' : 'Active') || subscriptionStatus === (isAr ? 'فترة تجريبية' : 'Trial') || subscriptionStatus === (isAr ? 'حساب أساسي' : 'Basic Account')
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-200 text-gray-600'
              }`}
              >
                {subscriptionStatus}
              </span>
            </div>
            <p className={`text-sm font-medium ${currentPlanId !== PLAN_ID.FREE ? 'text-indigo-700' : 'text-muted-foreground'}`}>
              {currentPlanId === PLAN_ID.FREE ? (isAr ? 'قم بالترقية للوصول إلى مزايا أكثر' : 'Upgrade to get more benefits') : (isAr ? 'تتمتع بكافة مزايا باقتك' : 'You are enjoying all your plan benefits')}
            </p>
          </div>
        </div>

        {currentPlanId !== PLAN_ID.FREE && (
          <div className="hidden items-center gap-2 rounded-2xl border border-border bg-card/50 px-4 py-2 text-sm font-bold text-indigo-800 shadow-sm dark:text-indigo-400 md:flex">
            <ShieldCheck className="size-4 text-emerald-500" />
            {isAr ? 'اشتراك فعّال' : 'Active Subscription'}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-[2rem] border bg-card shadow-xl shadow-gray-100/50 transition-all hover:scale-[1.02] hover:shadow-2xl ${plan.popular ? 'border-primary/30 ring-2 ring-primary/10' : 'border-border'
              } ${isCurrentPlan ? 'border-emerald-200 ring-2 ring-emerald-500/30' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && !isCurrentPlan && (
                <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-black tracking-wider text-primary-foreground">
                  {isAr ? 'الأكثر شيوعاً' : 'Most Popular'}
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black tracking-wider text-white">
                  <Check className="size-3" />
                  {isAr ? 'باقتك الحالية' : 'Current Plan'}
                </div>
              )}

              {/* Card Header */}
              <div className={`p-8 text-start ${plan.color === 'indigo'
                ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/30'
                : plan.color === 'purple'
                  ? 'bg-gradient-to-br from-purple-50/50 to-pink-50/30'
                  : 'bg-muted/10'
              }`}
              >
                <div className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${plan.color === 'indigo'
                  ? 'bg-indigo-100 text-indigo-600'
                  : plan.color === 'purple'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-muted text-muted-foreground'
                }`}
                >
                  <Icon className="size-7" />
                </div>
                <h3 className="mb-1 text-xl font-black text-foreground">{plan.name}</h3>
                <p className="text-sm font-medium text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  {plan.price === 0
                    ? (
                        <>
                          <span className="text-4xl font-black text-foreground">{isAr ? 'مجاناً' : 'Free'}</span>
                          <span className="text-sm font-bold text-muted-foreground">{isAr ? '/ أول 7 أيام' : '/ First 7 days'}</span>
                        </>
                      )
                    : (
                        <>
                          <span className="text-4xl font-black text-foreground">{plan.price}</span>
                          <span className="text-sm font-bold text-muted-foreground">{isAr ? 'دولار / شهرياً' : 'USD / month'}</span>
                        </>
                      )}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-1 flex-col gap-4 p-8">
                {plan.features.map((feature) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={feature.text} className="flex items-center gap-3 text-start">
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${plan.color === 'indigo'
                        ? 'bg-indigo-50 text-indigo-500'
                        : plan.color === 'purple'
                          ? 'bg-purple-50 text-purple-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      >
                        <FeatureIcon className="size-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="p-8 pt-0">
                {isCurrentPlan
                  ? (
                      <div className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-700">
                        <Check className="size-5" />
                        {isAr ? 'مفعّلة' : 'Active'}
                      </div>
                    )
                  : (
                      <button
                        type="button"
                        className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-bold transition-all active:scale-95 ${plan.popular
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        <Zap className="size-4" />
                        {currentPlanId === PLAN_ID.FREE ? (isAr ? 'ترقية الآن' : 'Upgrade Now') : (isAr ? 'تغيير الباقة' : 'Change Plan')}
                      </button>
                    )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
