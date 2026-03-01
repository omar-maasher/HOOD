'use client';

import { useLocale } from 'next-intl';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from '@/libs/i18nNavigation';
import { Logo } from '@/templates/Logo';

export function DashboardSidebar({ menu }: { menu: any[] }) {
  const locale = useLocale();
  const { state } = useSidebar();

  return (
    <Sidebar
      className="border-border/50 shadow-lg"
      collapsible="icon"
      side={locale === 'ar' ? 'right' : 'left'}
    >
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo isTextHidden={state === 'collapsed'} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* We can group the navigation items */}
        <SidebarGroup>
          <SidebarGroupLabel>{locale === 'ar' ? 'الرئيسية' : 'Main'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.filter(item => !item.children).map(item => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {menu.filter(item => item.children).map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.children!.map((child: any) => (
                  <SidebarMenuItem key={child.label}>
                    <SidebarMenuButton asChild tooltip={child.label}>
                      <Link href={child.href}>
                        {child.icon}
                        <span>{child.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
