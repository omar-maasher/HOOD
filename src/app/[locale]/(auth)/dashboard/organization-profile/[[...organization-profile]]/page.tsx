import { OrganizationProfile } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';

export default async function OrganizationProfilePage(props: { params: { locale: string } }) {
  const t = await getTranslations('OrganizationProfile');

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t('title_bar')}
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-base">
            إدارة إعدادات منظمتك وأعضاء الفريق.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden">
          <OrganizationProfile
            routing="path"
            path={getI18nPath(
              '/dashboard/organization-profile',
              props.params.locale,
            )}
            appearance={{
              variables: {
                colorPrimary: '#4f46e5',
                colorText: '#1f2937',
                fontFamily: 'inherit',
                borderRadius: '1rem',
              },
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full shadow-none bg-transparent rounded-none border-0',
                navbar: 'border-l-0 border-r border-border/50 md:pr-6 bg-transparent',
                navbarButton: 'flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-muted-foreground hover:bg-muted data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20 data-[active=true]:scale-[1.02]',
                scrollBox: 'bg-transparent',
                profileSection: 'bg-transparent',
                profileSectionTitleText: 'text-xl font-bold text-start',
                profileSectionSubtitleText: 'text-sm text-muted-foreground text-start',
                profileSectionContent: 'text-start',
                profileSectionItem: 'border-b border-border/30 py-4',
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white h-11 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 px-6',
                formButtonReset: 'hover:bg-muted text-muted-foreground h-11 rounded-2xl font-bold transition-all px-5',
                formFieldInput: 'rounded-2xl h-14 bg-muted/30 border-none focus-visible:ring-primary text-base',
                formFieldLabel: 'text-lg font-bold text-start',
                badge: 'bg-emerald-100/50 text-emerald-700 border-emerald-200/50 rounded-xl font-bold text-xs px-3 py-1',
                tableHead: 'text-muted-foreground font-bold text-sm',
                table: 'text-start',
                avatarBox: 'rounded-2xl shadow-sm border border-border/50',
                userPreviewMainIdentifier: 'font-bold text-gray-900',
                userPreviewSecondaryIdentifier: 'text-muted-foreground text-sm',
                membersPageInviteButton: 'bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all',
                tagInputContainer: 'rounded-2xl h-14 bg-muted/30 border-none focus-within:ring-primary text-base',
                headerTitle: 'text-xl font-bold text-start',
                headerSubtitle: 'text-sm text-muted-foreground text-start',
              },
            }}
          />
      </div>
    </div>
  );
}
