import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredMenu } from '@/features/landing/CenteredMenu';
import { Section } from '@/features/landing/Section';
import { Link } from '@/libs/i18nNavigation';

import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');

  return (
    <Section className="px-3 py-6">
      <CenteredMenu
        logo={<Logo />}
        rightMenu={(
          <>
            <li>
              <ThemeToggle />
            </li>
            <li data-fade>
              <LocaleSwitcher />
            </li>
            <li className="ml-1 mr-2.5" data-fade>
              <Link href="/sign-in">{t('sign_in')}</Link>
            </li>
            <li>
              <Link className={buttonVariants()} href="/sign-up">
                {t('sign_up')}
              </Link>
            </li>
          </>
        )}
      >
        <li>
          <Link href="/#features" className="scroll-smooth font-medium">{t('features')}</Link>
        </li>
        <li>
          <Link href="/#challenges" className="scroll-smooth font-medium">{t('challenges')}</Link>
        </li>
        <li>
          <Link href="/#services" className="scroll-smooth font-medium">{t('services')}</Link>
        </li>
        <li>
          <Link href="/#bonuses" className="scroll-smooth font-medium">{t('bonuses')}</Link>
        </li>
        <li>
          <Link href="/#pricing" className="scroll-smooth font-medium">{t('pricing')}</Link>
        </li>
      </CenteredMenu>
    </Section>
  );
};
