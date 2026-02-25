import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { Home, Users, Settings, Puzzle, Sparkles, Store, ShoppingBag, MessageSquare, Calendar, Crown } from 'lucide-react';
export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const t = useTranslations('DashboardLayout');

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
          <DashboardHeader
            menu={[
              {
                href: '/dashboard',
                label: t('home'),
                icon: <Home className="size-4" />,
              },
              {
                href: '/dashboard/products',
                label: 'المنتجات',
                icon: <ShoppingBag className="size-4" />,
              },
              {
                href: '/dashboard/leads',
                label: 'العملاء',
                icon: <MessageSquare className="size-4" />,
              },
              {
                href: '/dashboard/bookings',
                label: 'الحجوزات',
                icon: <Calendar className="size-4" />,
              },
              {
                href: '#',
                label: 'الإعدادات',
                icon: <Settings className="size-4" />,
                children: [
                  {
                    href: '/dashboard/subscription',
                    label: 'الاشتراك',
                    icon: <Crown className="size-4" />,
                  },
                  {
                    href: '/dashboard/business',
                    label: 'بيانات النشاط',
                    icon: <Store className="size-4" />,
                  },
                  {
                    href: '/dashboard/ai-settings',
                    label: 'الذكاء الاصطناعي',
                    icon: <Sparkles className="size-4" />,
                  },
                  {
                    href: '/dashboard/integrations',
                    label: t('integrations'),
                    icon: <Puzzle className="size-4" />,
                  },
                  {
                    href: '/dashboard/organization-profile/organization-members',
                    label: t('members'),
                    icon: <Users className="size-4" />,
                  },
                  {
                    href: '/dashboard/organization-profile',
                    label: 'إعدادات المنظمة',
                    icon: <Settings className="size-4" />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <div className="min-h-[calc(100vh-72px)] bg-muted">
        <div className="mx-auto max-w-screen-xl px-3 pb-16 pt-6">
          {props.children}
        </div>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
