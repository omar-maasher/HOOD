import { Calendar, Crown, Home, LayoutTemplate, MessageSquare, Puzzle, Settings, ShoppingBag, Sparkles, Store, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

  const menu = [
    {
      href: '/dashboard',
      label: t('home'),
      icon: <Home className="size-4" />,
    },
    {
      href: '/dashboard/products',
      label: t('products'),
      icon: <ShoppingBag className="size-4" />,
    },
    {
      href: '/dashboard/leads',
      label: t('leads'),
      icon: <MessageSquare className="size-4" />,
    },
    {
      href: '/dashboard/bookings',
      label: t('bookings'),
      icon: <Calendar className="size-4" />,
    },
    {
      href: '#',
      label: t('settings'),
      icon: <Settings className="size-4" />,
      children: [
        {
          href: '/dashboard/subscription',
          label: t('subscription'),
          icon: <Crown className="size-4" />,
        },
        {
          href: '/dashboard/business',
          label: t('business'),
          icon: <Store className="size-4" />,
        },
        {
          href: '/dashboard/ai-settings',
          label: t('ai_settings'),
          icon: <Sparkles className="size-4" />,
        },
        {
          href: '/dashboard/integrations',
          label: t('integrations'),
          icon: <Puzzle className="size-4" />,
        },
        {
          href: '/dashboard/whatsapp-templates',
          label: t('whatsapp_templates'),
          icon: <LayoutTemplate className="size-4" />,
        },
        {
          href: '/dashboard/organization-profile/organization-members',
          label: t('members'),
          icon: <Users className="size-4" />,
        },
        {
          href: '/dashboard/organization-profile',
          label: t('org_settings'),
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
