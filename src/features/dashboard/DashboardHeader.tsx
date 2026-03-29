'use client';

import { UserButton } from '@clerk/nextjs';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const DashboardHeader = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 sm:flex">
          <div className="rounded-full transition-colors hover:bg-muted">
            <ThemeToggle />
          </div>
          <div className="rounded-full transition-colors hover:bg-muted">
            <LocaleSwitcher />
          </div>
        </div>

        <div className="mx-1 hidden h-6 w-px bg-border/80 sm:block" />

        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/dashboard/user-profile"
            appearance={{
              elements: {
                rootBox: 'hover:scale-110 transition-transform',
                userButtonAvatarBox: 'h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/50 transition-all rounded-full',
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
