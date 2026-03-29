'use client';

import { arSA, enUS, frFR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { AppConfig } from '@/utils/AppConfig';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let clerkLocale = enUS;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';
  let afterSignOutUrl = '/';

  if (props.params.locale === 'fr') {
    clerkLocale = frFR;
  } else if (props.params.locale === 'ar') {
    clerkLocale = {
      ...arSA,
      organizationSwitcher: {
        ...arSA.organizationSwitcher,
        action__manageOrganization: 'إدارة المتجر', // Better translation for Manage Organization
      },
    } as any;
  }

  if (props.params.locale !== AppConfig.defaultLocale) {
    signInUrl = `/${props.params.locale}${signInUrl}`;
    signUpUrl = `/${props.params.locale}${signUpUrl}`;
    dashboardUrl = `/${props.params.locale}${dashboardUrl}`;
    afterSignOutUrl = `/${props.params.locale}${afterSignOutUrl}`;
  }

  return (
    <ClerkProvider
      // PRO: Dark mode support for Clerk with Hoodtrading Orange branding
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#F15A24',
          colorBackground: '#0a0a0a',
          colorText: '#ffffff',
          borderRadius: '1rem',
        },
        elements: {
          card: 'bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden sm:p-10',
          headerTitle: 'text-3xl font-black tracking-tighter text-white',
          headerSubtitle: 'text-slate-400 font-bold',
          socialButtonsBlockButton: 'rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all text-sm font-bold h-12',
          formButtonPrimary: 'bg-[#F15A24] hover:bg-[#d44d1e] rounded-2xl h-12 text-sm font-black transition-all shadow-xl shadow-orange-950/20 uppercase tracking-widest',
          formFieldInput: 'rounded-2xl bg-white/5 border-white/10 focus:ring-offset-0 focus:ring-1 focus:ring-[#F15A24] h-12 text-sm font-bold transition-all',
          footerActionLink: 'text-[#F15A24] hover:text-[#d44d1e] font-black',
          dividerLine: 'bg-white/5',
          dividerText: 'text-slate-500 font-black text-[10px] uppercase tracking-widest',
          identityPreviewText: 'text-slate-200 font-bold',
          identityPreviewEditButtonIcon: 'text-[#F15A24]',
          formFieldLabel: 'text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3',
          formFieldLabelRow: 'mb-0',
          socialButtonsIconButton: 'rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-[#F15A24]',
        },
      }}
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      afterSignOutUrl={afterSignOutUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
