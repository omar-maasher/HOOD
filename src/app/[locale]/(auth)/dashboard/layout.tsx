import { Calendar, Crown, Home, MessageSquare, Puzzle, Settings, ShoppingBag, Sparkles, Store, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/features/dashboard/DashboardSidebar';

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
  const locale = useLocale();
  const isAr = locale === 'ar';

  const menu = [
    {
      href: '/dashboard',
      label: t('home'),
      icon: <Home className="size-4" />,
    },
    {
      href: '/dashboard/products',
      label: isAr ? 'المنتجات' : 'Products',
      icon: <ShoppingBag className="size-4" />,
    },
    {
      href: '/dashboard/leads',
      label: isAr ? 'العملاء' : 'Leads',
      icon: <MessageSquare className="size-4" />,
    },
    {
      href: '/dashboard/bookings',
      label: isAr ? 'الحجوزات' : 'Bookings',
      icon: <Calendar className="size-4" />,
    },
    {
      href: '#',
      label: isAr ? 'الإعدادات' : 'Settings',
      icon: <Settings className="size-4" />,
      children: [
        {
          href: '/dashboard/subscription',
          label: isAr ? 'الاشتراك' : 'Subscription',
          icon: <Crown className="size-4" />,
        },
        {
          href: '/dashboard/business',
          label: isAr ? 'بيانات النشاط' : 'Business Settings',
          icon: <Store className="size-4" />,
        },
        {
          href: '/dashboard/ai-settings',
          label: isAr ? 'الذكاء الاصطناعي' : 'AI Settings',
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
          label: isAr ? 'إعدادات المنظمة' : 'Org Settings',
          icon: <Settings className="size-4" />,
        },
      ],
    },
  ];

  return (
    <SidebarProvider>
      <DashboardSidebar menu={menu} />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sm:px-6">
          <DashboardHeader />
        </header>

        <div className="flex-1 bg-muted p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-2xl">
            {props.children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const dynamic = 'force-dynamic';
