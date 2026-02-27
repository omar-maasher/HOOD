import { Crown, Building2, ShieldCheck, Check, Zap, MessageSquare, Bot, Megaphone, Users, CalendarCheck, Radio } from 'lucide-react';

import { PricingPlanList, PLAN_ID } from '@/utils/AppConfig';

export default async function SubscriptionPage() {
  let currentPlanId: string = PLAN_ID.FREE;
  let subscriptionStatus = 'حساب أساسي';

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
          subscriptionStatus = 'نشط';
        } else if (orgData.stripeSubscriptionStatus === 'trialing') {
          subscriptionStatus = 'فترة تجريبية';
        } else {
          subscriptionStatus = orgData.stripeSubscriptionStatus || 'غير نشط';
        }
      }
    }
  } catch (error) {
    console.error('Subscription page error:', error);
  }

  const plans = [
    {
      id: PLAN_ID.FREE,
      name: 'Trial – 7 أيام',
      price: 0,
      description: 'جرّب النظام مجاناً لمدة 7 أيام بدون التزام',
      icon: Building2,
      color: 'gray',
      trial: true,
      features: [
        { icon: Radio, text: '3 قنوات (واتساب، انستقرام، ماسنجر)' },
        { icon: MessageSquare, text: '150 محادثة' },
        { icon: Bot, text: '300 رسالة AI' },
        { icon: Megaphone, text: '1 حملة (حتى 150 مستلم)' },
        { icon: Users, text: 'CRM حتى 200 عميل' },
        { icon: CalendarCheck, text: 'نظام حجوزات مفعّل' },
      ],
    },
    {
      id: PLAN_ID.PREMIUM,
      name: 'باقة بريميوم',
      price: 39,
      description: 'مناسبة لمتجر متوسط',
      icon: Crown,
      color: 'indigo',
      popular: true,
      features: [
        { icon: Radio, text: '3 قنوات' },
        { icon: MessageSquare, text: '2,000 محادثة' },
        { icon: Bot, text: '2,000 رسالة AI' },
        { icon: Megaphone, text: '2 حملات (حتى 2,000 مستلم)' },
        { icon: Users, text: 'CRM حتى 5,000 عميل' },
        { icon: CalendarCheck, text: 'تقارير متقدمة' },
        { icon: Zap, text: 'أتمتة أساسية' },
      ],
    },
    {
      id: PLAN_ID.ENTERPRISE,
      name: 'باقة الشركات',
      price: 69,
      description: 'للشركات والمؤسسات الكبرى',
      icon: ShieldCheck,
      color: 'purple',
      features: [
        { icon: Radio, text: '3 قنوات' },
        { icon: MessageSquare, text: '7,000 محادثة' },
        { icon: Bot, text: '7,000 رسالة AI' },
        { icon: Megaphone, text: '5 حملات (حتى 7,000 مستلم)' },
        { icon: Users, text: 'CRM غير محدود' },
        { icon: Zap, text: 'أتمتة متقدمة' },
        { icon: Radio, text: 'Webhooks' },
        { icon: CalendarCheck, text: 'تقارير احترافية' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            الاشتراك والباقات
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-base">
            اختر الباقة المناسبة لنشاطك التجاري.
          </p>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div className={`relative overflow-hidden rounded-[2rem] border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm ${currentPlanId !== PLAN_ID.FREE
        ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-100/40'
        : 'bg-muted/10 border-border/30'
        }`}>
        <div className="flex items-center gap-4 text-start">
          <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${currentPlanId !== PLAN_ID.FREE ? 'bg-indigo-100/80 text-indigo-600' : 'bg-primary/10 text-primary'
            }`}>
            {currentPlanId !== PLAN_ID.FREE ? <Crown className="size-6" /> : <Building2 className="size-6" />}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h3 className={`text-lg font-bold ${currentPlanId !== PLAN_ID.FREE ? 'text-indigo-900' : 'text-gray-900'}`}>
                باقتك الحالية: {plans.find(p => p.id === currentPlanId)?.name}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase ${subscriptionStatus === 'نشط' || subscriptionStatus === 'فترة تجريبية' || subscriptionStatus === 'حساب أساسي'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-200 text-gray-600'
                }`}>
                {subscriptionStatus}
              </span>
            </div>
            <p className={`text-sm font-medium ${currentPlanId !== PLAN_ID.FREE ? 'text-indigo-700' : 'text-muted-foreground'}`}>
              {currentPlanId === PLAN_ID.FREE ? 'قم بالترقية للوصول إلى مزايا أكثر' : 'تتمتع بكافة مزايا باقتك'}
            </p>
          </div>
        </div>

        {currentPlanId !== PLAN_ID.FREE && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/50 border border-border text-indigo-800 dark:text-indigo-400 text-sm font-bold shadow-sm">
            <ShieldCheck className="size-4 text-emerald-500" />
            اشتراك فعّال
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative bg-card border rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden flex flex-col transition-all hover:scale-[1.02] hover:shadow-2xl ${plan.popular ? 'border-primary/30 ring-2 ring-primary/10' : 'border-border'
                } ${isCurrentPlan ? 'ring-2 ring-emerald-500/30 border-emerald-200' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && !isCurrentPlan && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-black tracking-wider">
                  الأكثر شيوعاً
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black tracking-wider flex items-center gap-1">
                  <Check className="size-3" />
                  باقتك الحالية
                </div>
              )}

              {/* Card Header */}
              <div className={`p-8 text-start ${plan.color === 'indigo' ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/30' :
                plan.color === 'purple' ? 'bg-gradient-to-br from-purple-50/50 to-pink-50/30' :
                  'bg-muted/10'
                }`}>
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-4 ${plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                  <Icon className="size-7" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{plan.description}</p>
                <div className="flex items-baseline gap-1 mt-4">
                  {plan.price === 0 ? (
                    <>
                      <span className="text-4xl font-black text-foreground">مجاناً</span>
                      <span className="text-muted-foreground font-bold text-sm">/ أول 7 أيام</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-black text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground font-bold text-sm">دولار / شهرياً</span>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="p-8 flex-1 flex flex-col gap-4">
                {plan.features.map((feature, idx) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-start">
                      <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${plan.color === 'indigo' ? 'bg-indigo-50 text-indigo-500' :
                        plan.color === 'purple' ? 'bg-purple-50 text-purple-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                        <FeatureIcon className="size-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="p-8 pt-0">
                {isCurrentPlan ? (
                  <div className="w-full h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-emerald-700 font-bold">
                    <Check className="size-5" />
                    مفعّلة
                  </div>
                ) : (
                  <button className={`w-full h-12 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.popular
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}>
                    <Zap className="size-4" />
                    {currentPlanId === PLAN_ID.FREE ? 'ترقية الآن' : 'تغيير الباقة'}
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
