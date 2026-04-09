import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getLocale, getTranslations } from 'next-intl/server';

import { db } from '@/libs/DB';
import { aiSettingsSchema, conversationSchema } from '@/models/Schema';

import { CommentsClient } from './CommentsClient';

export async function generateMetadata() {
  const t = await getTranslations('Comments');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function CommentsPage(props: { searchParams?: Promise<{ postId?: string }> }) {
  const { orgId } = await auth();
  const locale = await getLocale();

  if (!orgId) {
    return <div>Unauthorized</div>;
  }

  const aiSettings = await db.query.aiSettingsSchema.findFirst({
    where: eq(aiSettingsSchema.organizationId, orgId),
  });

  const conversations = await db.query.conversationSchema.findMany({
    where: eq(conversationSchema.organizationId, orgId),
    orderBy: (conv, { desc }) => [desc(conv.lastMessageAt)],
  });

  const searchParams = props.searchParams ? await props.searchParams : {};
  const initialPostId = searchParams.postId || null;

  return (
    <CommentsClient
      initialConversations={JSON.parse(JSON.stringify(conversations))}
      isAr={locale === 'ar'}
      botName={aiSettings?.botName ?? (locale === 'ar' ? 'مساعد المتجر' : 'Store Assistant')}
      initialPostId={initialPostId}
    />
  );
}

export const dynamic = 'force-dynamic';
