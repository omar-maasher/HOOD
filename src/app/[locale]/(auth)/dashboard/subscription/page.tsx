import { auth } from '@clerk/nextjs/server';
import { Bot, Building2, CalendarCheck, Check, Crown, Megaphone, MessageSquare, Radio, ShieldCheck, Users, Zap } from 'lucide-react';
import React from 'react';

import { createCheckoutSession } from '@/features/billing/actions';
import { Env } from '@/libs/Env';
import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

export default async function SubscriptionPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isAr = locale === 'ar';

  let currentPlanId: string = PLAN_ID.FREE;
  let subscriptionStatus = isAr ? 'حساب أساسي' : 'Basic Account';
  let userId: string | null = null;
  const whatsappNumber = '966524318721';

  try {
    const authData = await auth();
    userId = authData.userId;
    // سنقوم بتشغيل فحص قاعدة البيانات لاحقاً بعد التأكد من هذه النسخة
  } catch (error) {
    console.error('Clerk Auth Error in Subscription Page:', error);
  }

  const plans = [
    {
      id: PLAN_ID.FREE,
      name: isAr ? 'Trial – 7 أيام' : 'Trial – 7 Days',
      price: 0,
      description: isAr ? 'جرّب النظام مجاناً لمدة 7 أيام بدون التزام' : 'Try the system for free for 7 days without commitment',
      icon: Building2,
      color: 'gray',
      features: [
        { icon: Radio, text: isAr ? '3 قنوات (واتساب، انستقرام، ماسنجر)' : '3 Channels (WhatsApp, Instagram, Messenger)' },
        { icon: MessageSquare, text: isAr ? '150 محادثة' : '150 Conversations' },
        { icon: Bot, text: isAr ? '300 رسالة AI' : '300 AI Messages' },
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
        { icon: Zap, text: isAr ? 'أتمتة متقدمة' : 'Advanced Automation' },
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const planConfig = PricingPlanList[plan.id];
          const stripePriceId = Env.BILLING_PLAN_ENV === 'prod' ? planConfig?.prodPriceId : (Env.BILLING_PLAN_ENV === 'test' ? planConfig?.testPriceId : planConfig?.devPriceId);

          return (
            <div key={plan.id} className={`relative flex flex-col overflow-hidden rounded-[2rem] border bg-card shadow-xl transition-all hover:scale-[1.02] ${plan.popular ? 'border-primary/30 ring-2 ring-primary/10' : 'border-border'}`}>
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
                {isCurrentPlan ? (
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
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white transition-all hover:bg-emerald-700">
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
