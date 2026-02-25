import { auth } from '@clerk/nextjs/server';
import { UserProfile } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { Crown, Building2, ShieldCheck } from 'lucide-react';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';
import { getI18nPath } from '@/utils/Helpers';
import { PricingPlanList } from '@/utils/AppConfig';

export default async function MyAccountPage(props: { params: { locale: string } }) {
  const { orgId } = await auth();

  let subscriptionPlan = 'باقة مجانية';
  let subscriptionStatus = 'غير نشط';
  let isPremium = false;

  if (orgId) {
    const orgData = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, orgId),
    });

    if (orgData?.stripeSubscriptionPriceId) {
      const priceId = orgData.stripeSubscriptionPriceId;
      const premiumPriceIds = [PricingPlanList.premium?.devPriceId, PricingPlanList.premium?.prodPriceId, PricingPlanList.premium?.testPriceId];
      const enterprisePriceIds = [PricingPlanList.enterprise?.devPriceId, PricingPlanList.enterprise?.prodPriceId, PricingPlanList.enterprise?.testPriceId];

      if (premiumPriceIds.includes(priceId)) {
        subscriptionPlan = 'باقة بريميوم';
        isPremium = true;
      } else if (enterprisePriceIds.includes(priceId)) {
        subscriptionPlan = 'باقة الشركات';
        isPremium = true;
      }

      if (orgData.stripeSubscriptionStatus === 'active') {
        subscriptionStatus = 'نشط';
      } else if (orgData.stripeSubscriptionStatus === 'trialing') {
        subscriptionStatus = 'فترة تجريبية';
      } else {
        subscriptionStatus = orgData.stripeSubscriptionStatus || 'غير نشط';
      }
    } else {
      subscriptionStatus = 'حساب أساسي';
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            حسابي
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-base">
            إدارة بيانات حسابك الشخصي واشتراكك في النظام.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden">
        {/* Subscription Banner */}
        <div className={`px-8 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-5 border-b ${
          isPremium 
            ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-100/40'
            : 'bg-muted/10 border-border/30'
        }`}>
          <div className="flex items-center gap-4 text-start">
            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPremium ? 'bg-indigo-100/80 text-indigo-600' : 'bg-primary/10 text-primary'
            }`}>
              {isPremium ? <Crown className="size-6" /> : <Building2 className="size-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <h3 className={`text-lg font-bold ${isPremium ? 'text-indigo-900' : 'text-gray-900'}`}>نوع الاشتراك</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase ${
                  subscriptionStatus === 'نشط' || subscriptionStatus === 'فترة تجريبية' || subscriptionStatus === 'حساب أساسي'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {subscriptionStatus}
                </span>
              </div>
              <p className={`text-sm font-bold ${isPremium ? 'text-indigo-700' : 'text-muted-foreground'}`}>
                {subscriptionPlan}
              </p>
            </div>
          </div>
          
          {isPremium && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 border border-white/60 text-indigo-800 text-sm font-bold shadow-sm">
              <ShieldCheck className="size-4 text-emerald-500" />
              تتمتع بكافة مزايا النظام
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="p-8 md:p-10">
          <UserProfile
            routing="path"
            path={getI18nPath(
              '/dashboard/my-account',
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
                headerTitle: 'text-xl font-bold text-start',
                headerSubtitle: 'text-sm text-muted-foreground text-start',
                avatarBox: 'rounded-2xl shadow-sm border border-border/50',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
