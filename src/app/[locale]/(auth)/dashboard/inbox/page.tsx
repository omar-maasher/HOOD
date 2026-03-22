import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getLocale } from 'next-intl/server';

import { db } from '@/libs/DB';
import { conversationSchema } from '@/models/Schema';

import { InboxClient } from './InboxClient';

export default async function InboxPage() {
  const { orgId } = await auth();
  const locale = await getLocale();

  if (!orgId) {
    return <div>Unauthorized</div>;
  }

  // Initial fetch of conversations to speed up first load
  const conversations = await db.query.conversationSchema.findMany({
    where: eq(conversationSchema.organizationId, orgId),
    orderBy: (conv, { desc }) => [desc(conv.lastMessageAt)],
  });

  return (
    <InboxClient
      initialConversations={JSON.parse(JSON.stringify(conversations))}
      isAr={locale === 'ar'}
    />
  );
}
