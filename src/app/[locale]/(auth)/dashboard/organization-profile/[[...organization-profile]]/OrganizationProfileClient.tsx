'use client';

import { OrganizationProfile } from '@clerk/nextjs';
import { Building2, Crown, ShieldCheck } from 'lucide-react';

export default function OrganizationProfileClient({
  locale,
  subscriptionPlan,
  subscriptionStatus,
  isPremium,
}: {
  locale: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  isPremium: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Subscription Banner */}
      <div className={`relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all md:flex-row ${
        isPremium
          ? 'border-indigo-100/60 bg-gradient-to-r from-indigo-50 to-purple-50'
          : 'border-muted/50 bg-muted/30'
      }`}
      >
        <div className="flex items-center gap-6 text-start">
          <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl shadow-inner ${
            isPremium ? 'bg-indigo-100/80 text-indigo-600' : 'bg-muted text-muted-foreground'
          }`}
          >
            {isPremium ? <Crown className="size-8" /> : <Building2 className="size-8" />}
          </div>
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h3 className={`text-xl font-black ${isPremium ? 'text-indigo-900' : 'text-gray-900'}`}>باقة النظام</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${
                subscriptionStatus === 'نشط' || subscriptionStatus === 'فترة تجريبية' || subscriptionStatus === 'حساب أساسي'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
              >
                {subscriptionStatus}
              </span>
            </div>
            <p className={`text-lg font-bold ${isPremium ? 'text-indigo-700' : 'text-muted-foreground'}`}>
              {subscriptionPlan}
            </p>
          </div>
        </div>

        {isPremium && (
          <div className="hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/50 px-5 py-2.5 text-sm font-bold text-indigo-800 shadow-sm md:flex">
            <ShieldCheck className="size-5 text-emerald-500" />
            تتمتع بكافة مزايا النظام
          </div>
        )}
      </div>

      {/* Clerk Organization Profile */}
      <div className="overflow-hidden rounded-[2rem] border bg-card p-2 shadow-[0_20px_50px_rgba(0,0,0,0.02)] md:p-6 [&_.cl-card]:bg-transparent [&_.cl-card]:shadow-none [&_.cl-navbarButtonIcon]:ml-3 [&_.cl-navbarButtonIcon]:mr-0 [&_.cl-navbarButton]:w-full [&_.cl-navbarButton]:flex-row-reverse [&_.cl-navbarButton]:justify-start [&_.cl-navbarButton]:p-3 [&_.cl-navbar]:border-l [&_.cl-navbar]:border-r-0 [&_.cl-navbar]:pl-0 [&_.cl-navbar]:pr-6 [&_.cl-pageScrollBox]:[direction:rtl] [&_.cl-profileSection:has([data-localization-key*='deleteOrganization'])]:!hidden [&_.cl-profileSection:has([data-localization-key*='leaveOrganization'])]:!hidden [&_.cl-profileSection:has(button[data-localization-key*='deleteOrganization'])]:!hidden [&_.cl-profileSection:has(button[data-localization-key*='leaveOrganization'])]:!hidden [&_.cl-scrollBox]:bg-transparent" dir="rtl">

        <OrganizationProfile
          routing="path"
          path={`/${locale}/dashboard/organization-profile`}
          appearance={{
            variables: {
              colorPrimary: '#4f46e5',
              colorText: '#1f2937',
              fontFamily: 'inherit',
            },
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full shadow-none bg-transparent rounded-none border-0',
              navbar: 'bg-transparent',
              navbarButton: 'rounded-2xl text-muted-foreground hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-extrabold transition-all py-3',
              navbarButtonIcon: 'mr-2 ml-2 size-5',
              scrollBox: 'bg-transparent',
              profileSection: 'bg-transparent',
              profileSectionTitleText: 'text-2xl font-black text-gray-900',
              profileSectionSubtitleText: 'text-base font-medium text-muted-foreground',
              profileSectionItem: 'border-b border-border/50 py-4',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white h-12 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 text-base px-8',
              formButtonReset: 'hover:bg-muted text-muted-foreground h-12 rounded-2xl font-bold transition-all text-base px-6',
              formFieldInput: 'h-14 rounded-2xl bg-muted/30 border-transparent hover:border-border focus:border-primary shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20 transition-all',
              formFieldLabel: 'font-bold text-gray-700 text-sm mb-1',
              badge: 'bg-emerald-100/50 text-emerald-700 border-emerald-200/50 rounded-xl font-extrabold text-xs px-3 py-1',
              tableHead: 'text-muted-foreground font-black text-sm uppercase tracking-widest',
              avatarBox: 'size-12 rounded-2xl shadow-sm border border-border/50',
              userPreviewMainIdentifier: 'font-bold text-gray-900',
              userPreviewSecondaryIdentifier: 'text-muted-foreground text-sm font-medium',
            },
          }}
        />
      </div>
    </div>
  );
}
