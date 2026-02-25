import Image from 'next/image';

import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center gap-2 text-xl font-semibold">
    <Image 
      src="/logo.png" 
      alt={`${AppConfig.name} Logo`} 
      width={40} 
      height={40} 
      className="object-contain"
    />
    {!props.isTextHidden && AppConfig.name}
  </div>
);
