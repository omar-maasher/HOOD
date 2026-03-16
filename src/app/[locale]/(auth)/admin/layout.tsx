import { currentUser } from '@clerk/nextjs/server';
import { Building2, Home, MessageSquare, ShieldAlert, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
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
    namespace: 'Admin',
  });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AdminLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const user = await currentUser();
  const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];
  const isSuperAdmin = user?.emailAddresses.some(e => superAdminEmails.includes(e.emailAddress));

  if (!isSuperAdmin) {
    redirect('/dashboard');
  }

  const t = await getTranslations('Admin');

  const menu = [
    {
      href: '/dashboard',
      label: props.params.locale === 'ar' ? 'الرئيسية' : 'Home',
      icon: <Home className="size-4" />,
    },
    {
      href: '/admin',
      label: t('title'),
      icon: <ShieldAlert className="size-4 text-red-500" />,
    },
    {
      href: '#',
      label: t('management'),
      icon: <Building2 className="size-4" />,
      children: [
        {
          href: '/admin',
          label: t('platform_orgs'),
          icon: <Users className="size-4" />,
        },
        {
          href: '/dashboard/leads', // Redirect to shared leads view or separate global leads
          label: t('global_leads'),
          icon: <MessageSquare className="size-4" />,
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
