import { getLocale, getTranslations } from 'next-intl/server';

import { PostsClient } from './PostsClient';

export async function generateMetadata() {
  const t = await getTranslations('Posts');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function PostsPage() {
  const locale = await getLocale();
  return <PostsClient isAr={locale === 'ar'} />;
}

export const dynamic = 'force-dynamic';
