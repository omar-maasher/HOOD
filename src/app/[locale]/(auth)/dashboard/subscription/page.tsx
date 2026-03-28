import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { Bot, Building2, CalendarCheck, Check, Crown, Megaphone, MessageSquare, Radio, ShieldCheck, Users, Zap } from 'lucide-react';
import React from 'react';

import { createCheckoutSession } from '@/features/billing/actions';
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
import { organizationSchema } from '@/models/Schema';
import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

export default async function SubscriptionPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isAr = locale === 'ar';

  let currentPlanId: string = PLAN_ID.FREE;
  let subscriptionStatus = isAr ? 'حساب أساسي' : 'Basic Account';
  let currentOrgId: string | null | undefined = null;
  const whatsappNumber = '966524318721';

  try {
    const { orgId } = await auth();
    currentOrgId = orgId;

    if (orgId) {
      const orgData = await db.query.organizationSchema.findFirst({
        where: eq(organizationSchema.id, orgId),
      });

      if (orgData) {
        if (orgData.planId === PLAN_ID.PREMIUM) {
          currentPlanId = PLAN_ID.PREMIUM;
        } else if (orgData.planId === PLAN_ID.ENTERPRISE) {
          currentPlanId = PLAN_ID.ENTERPRISE;
        }

        if (orgData.stripeSubscriptionStatus === 'active') {
          subscriptionStatus = isAr ? 'نشط' : 'Active';
        } else if (orgData.stripeSubscriptionStatus === 'trialing') {
          subscriptionStatus = isAr ? 'فترة تجريبية' : 'Trial';
        } else if (orgData.stripeSubscriptionStatus) {
          subscriptionStatus = isAr ? 'مكتمل/معالج' : 'Processed';
        }
      }
    }
  } catch (error) {
    console.error('Subscription page error:', error);
  }

  const plans = [
    {
      id: PLAN_ID.FREE,
      name: isAr ? 'الباقة العادية' : 'Normal Plan',
      price: 35,
      description: isAr ? 'مثالية لمن يبحث عن الأساسيات' : 'Perfect for those looking for basics',
      icon: Building2,
      color: 'gray',
      features: [
        { icon: Radio, text: isAr ? '3 قنوات' : '3 Channels' },
        { icon: MessageSquare, text: isAr ? '150 محادثة' : '150 Conversations' },
        { icon: Bot, text: isAr ? '300 رسالة AI' : '300 AI Messages' },
        { icon: CalendarCheck, text: isAr ? 'نظام حجوزات مفعّل' : 'Active Booking System' },
      ],
    },
    {
      id: PLAN_ID.PREMIUM,
      name: isAr ? 'باقة بريميوم' : 'Premium Plan',
      price: 50,
      description: isAr ? 'مناسبة لمتجر متوسط' : 'Suitable for a medium store',
      icon: Crown,
      color: 'indigo',
      popular: true,
      features: [
        { icon: Radio, text: isAr ? '3 قنوات' : '3 Channels' },
        { icon: MessageSquare, text: isAr ? '2,000 محادثة' : '2,000 Conversations' },
        { icon: Bot, text: isAr ? '2,000 رسالة AI' : '2,000 AI Messages' },
        { icon: Megaphone, text: isAr ? 'حملات (حتى 2,000 مستلم)' : 'Campaigns (up to 2,000 recipients)' },
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
        { icon: Megaphone, text: isAr ? 'حملات (حتى 7,000 مستلم)' : 'Campaigns (up to 7,000 recipients)' },
        { icon: Users, text: isAr ? 'CRM غير محدود' : 'Unlimited CRM' },
        { icon: Zap, text: isAr ? 'أتمتة متقدمة' : 'Advanced Automation' },
        { icon: Radio, text: 'Webhooks' },
        { icon: CalendarCheck, text: isAr ? 'تقارير احترافية' : 'Professional Reports' },
      ],
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20">
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

      <div className={`relative flex flex-col items-center justify-between gap-5 overflow-hidden rounded-[2rem] border p-6 shadow-sm md:flex-row md:p-8 ${currentPlanId !== PLAN_ID.FREE ? 'border-indigo-100/40 bg-gradient-to-r from-indigo-50/80 to-purple-50/80' : 'border-border/30 bg-muted/10'}`}>
        <div className="flex items-center gap-4 text-start">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${currentPlanId !== PLAN_ID.FREE ? 'bg-indigo-100/80 text-indigo-600' : 'bg-primary/10 text-primary'}`}>
            {currentPlanId !== PLAN_ID.FREE ? <Crown className="size-6" /> : <Building2 className="size-6" />}
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-3">
              <h3 className={`text-lg font-bold ${currentPlanId !== PLAN_ID.FREE ? 'text-indigo-900' : 'text-gray-900'}`}>
                {isAr ? 'باقتك الحالية:' : 'Your Current Plan:'} {plans.find(p => p.id === currentPlanId)?.name}
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${subscriptionStatus.includes(isAr ? 'نشط' : 'Active') || subscriptionStatus === (isAr ? 'فترة تجريبية' : 'Trial') || subscriptionStatus === (isAr ? 'حساب أساسي' : 'Basic Account') ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {subscriptionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const planConfig = PricingPlanList[plan.id];
          const stripePriceId = Env.BILLING_PLAN_ENV === 'prod' ? planConfig?.prodPriceId : (Env.BILLING_PLAN_ENV === 'test' ? planConfig?.testPriceId : planConfig?.devPriceId);

          return (
            <div key={plan.id} className={`relative flex flex-col overflow-hidden rounded-[2rem] border bg-card shadow-xl transition-all hover:scale-[1.02] ${plan.popular ? 'border-primary/30 ring-2 ring-primary/10' : 'border-border'} ${isCurrentPlan ? 'border-emerald-200 ring-2 ring-emerald-500/30' : ''}`}>
              {plan.popular && (
                <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground uppercase tracking-wider">
                  {isAr ? 'الأكثر شيوعاً' : 'Most Popular'}
                </div>
              )}
              <div className={`p-8 text-start ${plan.color === 'indigo' ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/30' : plan.color === 'purple' ? 'bg-gradient-to-br from-purple-50/50 to-pink-50/30' : 'bg-muted/10'}`}>
                <div className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : plan.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-muted text-muted-foreground'}`}>
                  <plan.icon className="size-7" />
                </div>
                <h3 className="mb-1 text-xl font-black">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm font-bold">{isAr ? 'دولار / شهرياً' : 'USD / month'}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-start">
                    <feature.icon className="size-4 text-primary" />
                    <span className="text-sm font-bold">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 p-8 pt-0">
                {(isCurrentPlan && (subscriptionStatus === (isAr ? 'نشط' : 'Active') || subscriptionStatus === (isAr ? 'فترة تجريبية' : 'Trial'))) ? (
                  <div className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-700">
                    <Check className="size-5" /> {isAr ? 'مفعّلة' : 'Active'}
                  </div>
                ) : (
                  <>
                    {Env.STRIPE_SECRET_KEY && stripePriceId && (
                      <form action={async () => {
                        'use server';
                        await createCheckoutSession(stripePriceId!);
                      }}>
                        <button type="submit" className="h-12 w-full rounded-2xl bg-primary font-bold text-white transition-all hover:bg-primary/90">
                          {isAr ? 'دفع عبر البطاقة' : 'Pay with Card'}
                        </button>
                      </form>
                    )}
                    <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isAr ? `أهلاً، أرغب في تفعيل باقة (${plan.name}) لحسابي.\nمعرف المنظمة: ${currentOrgId}` : `Hello, I want to activate (${plan.name}) for my account.\nOrg ID: ${currentOrgId}`)}`} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white transition-all hover:bg-emerald-700">
                      {isAr ? 'تفعيل يدوي (واتساب)' : 'Manual Activation (WhatsApp)'}
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
