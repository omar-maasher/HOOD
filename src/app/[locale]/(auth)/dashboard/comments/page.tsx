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

export default async function CommentsPage() {
  const { orgId } = await auth();
  const locale = await getLocale();

  if (!orgId) {
    return <div>Unauthorized</div>;
  }

  const aiSettings = await db.query.aiSettingsSchema.findFirst({
    where: eq(aiSettingsSchema.organizationId, orgId),
  });

  // Fetch conversations that are from Instagram or Messenger (which support comments)
  // For now, let's just fetch all conversations and we'll filter on client side if needed
  // or just show all for the demo.
  const conversations = await db.query.conversationSchema.findMany({
    where: eq(conversationSchema.organizationId, orgId),
    orderBy: (conv, { desc }) => [desc(conv.lastMessageAt)],
  });

  return (
    <CommentsClient
      initialConversations={JSON.parse(JSON.stringify(conversations))}
      isAr={locale === 'ar'}
      botName={aiSettings?.botName ?? (locale === 'ar' ? 'مساعد المتجر' : 'Store Assistant')}
    />
  );
}

export const dynamic = 'force-dynamic';
