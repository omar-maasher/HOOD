import { OrganizationProfile } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';

export default async function OrganizationProfilePage(props: { params: { locale: string } }) {
  const t = await getTranslations('OrganizationProfile');

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20 duration-700 animate-in fade-in">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-600/5 blur-[120px]" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
        <div className="text-start">
          <h1 className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-sm">
            {t('title_bar')}
          </h1>
          <p className="mt-1.5 text-base font-bold text-muted-foreground/80">
            إدارة إعدادات منظمتك وأعضاء الفريق في Hoodtrading.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/50 shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
        <OrganizationProfile
          routing="path"
          path={getI18nPath(
            '/dashboard/organization-profile',
            props.params.locale,
          )}
          appearance={{
            variables: {
              colorPrimary: '#F15A24',
              colorText: 'inherit',
              fontFamily: 'inherit',
              borderRadius: '1rem',
            },
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full shadow-none bg-transparent rounded-none border-0',
              navbar: 'border-l-0 border-r border-border/50 md:pr-8 bg-transparent',
              navbarButton: 'flex items-center gap-3 px-5 py-4 rounded-2xl font-black transition-all duration-300 text-muted-foreground hover:bg-muted/80 hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-xl data-[active=true]:shadow-primary/25 data-[active=true]:scale-[1.02]',
              scrollBox: 'bg-transparent',
              profileSection: 'bg-transparent py-8',
              profileSectionTitleText: 'text-2xl font-black text-start tracking-tight text-foreground dark:text-white',
              profileSectionSubtitleText: 'text-sm font-medium text-muted-foreground text-start',
              profileSectionContent: 'text-start text-foreground dark:text-slate-200',
              profileSectionItem: 'border-b border-border/30 py-6 last:border-0',
              formButtonPrimary: 'bg-primary hover:bg-orange-600 text-white h-12 rounded-2xl font-black transition-all shadow-xl shadow-primary/25 active:scale-95 px-8 uppercase tracking-widest text-[11px]',
              formButtonReset: 'hover:bg-muted text-muted-foreground h-12 rounded-2xl font-black transition-all px-6 text-xs uppercase tracking-widest',
              formFieldInput: 'rounded-2xl h-14 bg-muted/40 border-none focus-visible:ring-primary text-base font-bold placeholder:text-slate-500',
              formFieldLabel: 'text-sm font-black text-start uppercase tracking-widest text-slate-500 mb-3 ml-1',
              badge: 'bg-primary/10 text-primary border-primary/20 rounded-xl font-black text-[10px] px-3 py-1 uppercase tracking-widest',
              tableHead: 'text-slate-500 font-black text-[10px] uppercase tracking-widest bg-muted/20 py-4 px-6 rounded-xl',
              table: 'text-start w-full border-separate border-spacing-y-2',
              tableRow: 'hover:bg-muted/30 transition-colors rounded-2xl',
              avatarBox: 'rounded-[1.25rem] shadow-lg border-2 border-primary/20 size-16',
              userPreviewMainIdentifier: 'font-black text-foreground dark:text-white text-base',
              userPreviewSecondaryIdentifier: 'text-muted-foreground font-bold text-sm',
              membersPageInviteButton: 'bg-primary hover:bg-orange-600 text-white rounded-2xl h-12 font-black shadow-xl shadow-primary/25 active:scale-95 transition-all px-8',
              tagInputContainer: 'rounded-2xl h-14 bg-muted/40 border-none focus-within:ring-primary text-base font-bold',
              headerTitle: 'text-3xl font-black text-start tracking-tighter text-foreground dark:text-white mb-2',
              headerSubtitle: 'text-base font-bold text-muted-foreground text-start mb-8',
            },
          }}
        />
      </div>
    </div>
  );
}
