import { getTranslations } from 'next-intl/server';

import { getBusinessProfile } from './actions';
import BusinessClient from './BusinessClient';

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

export default async function BusinessPage() {
  let profile = null;
  try {
    profile = await getBusinessProfile();
  } catch (error) {
    console.error('Business page error:', error);
  }

  return <BusinessClient profile={profile} />;
}
