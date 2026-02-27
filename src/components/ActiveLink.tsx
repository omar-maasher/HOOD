'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/Helpers';

export const ActiveLink = (props: { href: string; children: React.ReactNode; className?: string }) => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(props.href);

  return (
    <Link
      href={props.href}
      className={cn(
        props.className ||
        cn(
          'px-3 py-2',
          isActive && 'rounded-md bg-primary text-primary-foreground',
        ),
      )}
      data-active={isActive ? 'true' : undefined}
    >
      {props.children}
    </Link>
  );
};
