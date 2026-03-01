import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { AllLocales, AppConfig } from '@/utils/AppConfig';

export const { Link, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
});
