"use client";

import { OrganizationProfile } from '@clerk/nextjs';
import { Crown, Building2, ShieldCheck } from 'lucide-react';

export default function OrganizationProfileClient({ 
  locale,
  subscriptionPlan,
  subscriptionStatus,
  isPremium
}: { 
  locale: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  isPremium: boolean;
}) {

  return (
    <div className="flex flex-col gap-6">
      {/* Subscription Banner */}
      <div className={`relative overflow-hidden rounded-[2rem] border p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-all ${
        isPremium 
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100/60'
          : 'bg-muted/30 border-muted/50'
      }`}>
        <div className="flex items-center gap-6 text-start">
          <div className={`size-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
            isPremium ? 'bg-indigo-100/80 text-indigo-600' : 'bg-muted text-muted-foreground'
          }`}>
            {isPremium ? <Crown className="size-8" /> : <Building2 className="size-8" />}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-xl font-black ${isPremium ? 'text-indigo-900' : 'text-gray-900'}`}>باقة النظام</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${
                subscriptionStatus === 'نشط' || subscriptionStatus === 'فترة تجريبية' || subscriptionStatus === 'حساب أساسي'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {subscriptionStatus}
              </span>
            </div>
            <p className={`text-lg font-bold ${isPremium ? 'text-indigo-700' : 'text-muted-foreground'}`}>
              {subscriptionPlan}
            </p>
          </div>
        </div>
        
        {isPremium && (
          <div className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/50 border border-white/60 text-indigo-800 text-sm font-bold shadow-sm">
            <ShieldCheck className="size-5 text-emerald-500" />
            تتمتع بكافة مزايا النظام
          </div>
        )}
      </div>

      {/* Clerk Organization Profile */}
      <div className="bg-card border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden p-2 md:p-6 organization-profile-container" dir="rtl">
        <style dangerouslySetInnerHTML={{__html: `
          /* Hide leave and delete organization sections */
          .organization-profile-container .cl-profileSection:has([data-localization-key*="leaveOrganization"]),
          .organization-profile-container .cl-profileSection:has([data-localization-key*="deleteOrganization"]),
          .organization-profile-container .cl-profileSection:has(button[data-localization-key*="deleteOrganization"]),
          .organization-profile-container .cl-profileSection:has(button[data-localization-key*="leaveOrganization"]) {
            display: none !important;
          }

          .organization-profile-container .cl-scrollBox {
            background-color: transparent !important;
          }
          .organization-profile-container .cl-card {
            background-color: transparent !important;
            box-shadow: none !important;
          }
          
          /* RTL alignment overrides */
          .organization-profile-container .cl-navbar {
            border-left: 1px solid hsl(var(--border)) !important;
            border-right: none !important;
            padding-left: 0 !important;
            padding-right: 1.5rem !important;
          }

          .organization-profile-container .cl-navbarButton {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            flex-direction: row-reverse !important;
            padding: 0.75rem 1rem !important;
            width: 100% !important;
          }
          
          .organization-profile-container .cl-navbarButtonIcon {
            margin-left: 0.75rem !important;
            margin-right: 0 !important;
          }

          .organization-profile-container .cl-pageScrollBox {
            direction: rtl !important;
          }
        `}} />
        
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
