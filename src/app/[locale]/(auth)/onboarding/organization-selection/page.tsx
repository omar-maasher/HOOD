'use client';

import { useOrganizationList } from '@clerk/nextjs';
import { Building2, Check, Loader2, Sparkles, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/Helpers';

import { onboardingSaveBusinessProfile } from '../../dashboard/business/actions';

const OrganizationSelectionPage = () => {
  const t = useTranslations('Onboarding');
  const { createOrganization, setActive, isLoaded } = useOrganizationList();
  const [orgName, setOrgName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const businessTypes = [
    { id: 'store', label: t('type_store'), icon: <Store className="size-5" /> },
    { id: 'restaurant', label: t('type_restaurant'), icon: <Building2 className="size-5" /> },
    { id: 'clinic', label: t('type_clinic'), icon: <Sparkles className="size-5 text-blue-400" /> },
    { id: 'real_estate', label: t('type_real_estate'), icon: <Building2 className="size-5 text-amber-500" /> },
    { id: 'services', label: t('type_services'), icon: <Sparkles className="size-5 text-primary" /> },
    { id: 'other', label: t('type_other'), icon: <Building2 className="size-5 opacity-50" /> },
  ];

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !businessType || !createOrganization || loading) {
      console.log('Missing values or not loaded', { orgName, businessType, isLoaded });
      return;
    }

    setLoading(true);
    try {
      console.log('Creating organization...', orgName);
      // 1. Create Clerk Organization
      const org = await createOrganization({ name: orgName });
      console.log('Organization created:', org.id);

      // 2. Save Business Profile in DB immediately using the new org.id
      try {
        await onboardingSaveBusinessProfile(org.id, {
          businessName: orgName,
          businessType,
        });
        console.log('Business profile saved to DB during onboarding');
      } catch (dbError) {
        console.error('Failed to save business profile to DB during onboarding', dbError);
      }

      // 3. Set as active organization (Crucial for next steps)
      if (setActive) {
        await setActive({ organization: org.id });
        console.log('Organization set as active');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Onboarding failed', error);
      // eslint-disable-next-line no-alert
      alert('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 text-white">
      {/* Glow Effects */}
      <div className="absolute -right-40 -top-40 size-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-600/5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-2xl duration-700 animate-in fade-in zoom-in-95">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
            <Sparkles size={12} />
            {t('title')}
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tighter text-white">{t('title')}</h1>
          <p className="mx-auto max-w-md text-lg font-bold text-slate-400">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleOnboarding} className="space-y-8">
          <div className="grid gap-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 shadow-2xl backdrop-blur-3xl">
            <div className="space-y-3">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t('org_name')}</Label>
              <Input
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder={t('org_name_placeholder')}
                className="h-16 rounded-2xl border-white/10 bg-white/5 text-lg font-bold text-white shadow-inner transition-all focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-4">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t('business_type')}</Label>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {businessTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setBusinessType(type.id)}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-4 rounded-3xl p-6 border transition-all duration-300 active:scale-95 group',
                      businessType === type.id
                        ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(241,90,36,0.1)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]',
                    )}
                  >
                    <div className={cn(
                      'flex size-12 items-center justify-center rounded-2xl transition-all',
                      businessType === type.id ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 group-hover:text-slate-300',
                    )}
                    >
                      {type.icon}
                    </div>
                    <span className={cn(
                      'text-[11px] font-black uppercase tracking-tight text-center',
                      businessType === type.id ? 'text-primary' : 'text-slate-500 group-hover:text-slate-400',
                    )}
                    >
                      {type.label}
                    </span>
                    {businessType === type.id && (
                      <div className="absolute right-2 top-2">
                        <Check size={14} className="text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!orgName || !businessType || loading}
            className="h-16 w-full rounded-2xl bg-primary text-lg font-black shadow-2xl shadow-orange-950/40 transition-all hover:scale-[1.02] hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading
              ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" />
                    {t('creating')}
                  </div>
                )
              : (
                  t('submit')
                )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
