import Image from 'next/image';

import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center gap-2 text-xl font-bold tracking-tighter" suppressHydrationWarning>
    <Image
      src="/logo.png"
      alt={`${AppConfig.name} Logo`}
      width={36}
      height={36}
      className="object-contain transition-transform group-hover:scale-110"
    />
    {!props.isTextHidden && (
      <div className="flex items-center uppercase leading-none" dir="ltr">
        <span className="font-black text-foreground">HOOD</span>
        <span className="font-medium text-primary">TRADING</span>
      </div>
    )}
  </div>
);
