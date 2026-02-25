import { getTranslations } from 'next-intl/server';
import { getAiSettings } from './actions';
import AiSettingsClient from './AiSettingsClient';

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

export default async function AiSettingsPage() {
  const settings = await getAiSettings();

  return <AiSettingsClient settings={settings} />;
}
