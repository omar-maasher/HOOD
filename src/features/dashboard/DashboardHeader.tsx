'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { ActiveLink } from '@/components/ActiveLink';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ToggleMenuButton } from '@/components/ToggleMenuButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/templates/Logo';
import { getI18nPath } from '@/utils/Helpers';
import type { ReactNode } from 'react';

export const DashboardHeader = (props: {
  menu: {
    href: string;
    label: string;
    icon: ReactNode;
    children?: { href: string; label: string; icon: ReactNode }[];
  }[];
}) => {
  const locale = useLocale();

  return (
    <>
      <div className="flex items-center">
        <Link href="/dashboard" className="max-sm:hidden">
          <Logo />
        </Link>

        <svg
          className="size-8 stroke-muted-foreground mx-1 sm:mx-2 max-sm:hidden rtl:-scale-x-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M17 5 7 19" />
        </svg>

        <OrganizationSwitcher
          organizationProfileMode="navigation"
          organizationProfileUrl={getI18nPath(
            '/dashboard/organization-profile',
            locale,
          )}
          afterCreateOrganizationUrl="/dashboard"
          hidePersonal
          skipInvitationScreen
          appearance={{
            elements: {
              organizationSwitcherTrigger: 'max-w-28 sm:max-w-52 flex items-center gap-2 px-2',
              organizationSwitcherPopoverActionButton__createOrganization: 'hidden',
            },
          }}
        />

        <nav className="ms-8 max-lg:hidden">
          <ul className="flex flex-row items-center gap-x-2 text-base font-semibold">
            {props.menu.map((item) => {
              if (item.children) {
                return (
                  <li key={item.label}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer">
                        {item.icon}
                        {item.label}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl mt-2 min-w-[200px]">
                        {item.children.map(child => (
                          <DropdownMenuItem key={child.href} asChild>
                            <Link href={child.href} className="flex items-center gap-2 cursor-pointer py-2 px-3 hover:bg-muted font-medium w-full text-base">
                              {child.icon}
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <ActiveLink
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    {item.icon}
                    {item.label}
                  </ActiveLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div>
        <ul className="flex items-center gap-x-1.5 [&_li[data-fade]:hover]:opacity-100 [&_li[data-fade]]:opacity-60">
          <li data-fade>
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToggleMenuButton />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {props.menu.map((item) => {
                    if (item.children) {
                      return item.children.map(child => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link href={child.href} className="flex items-center gap-2 cursor-pointer font-medium p-3">
                            {child.icon}
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ));
                    }
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center gap-2 cursor-pointer font-medium p-3">
                          {item.icon}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>

          <li>
            <ThemeToggle />
          </li>

          <li data-fade>
            <LocaleSwitcher />
          </li>

          <li>
            <Separator orientation="vertical" className="h-4" />
          </li>

          <li>
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/dashboard/user-profile"
              appearance={{
                elements: {
                  rootBox: 'px-2 py-1.5',
                },
              }}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
