import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getLocale } from 'next-intl/server';

import { db } from '@/libs/DB';
import { conversationSchema, integrationSchema } from '@/models/Schema';

import { InboxClient } from './InboxClient';

export default async function InboxPage() {
  const { orgId } = await auth();
  const locale = await getLocale();

  if (!orgId) {
    return <div>Unauthorized</div>;
  }

  // Initial fetch of conversations
  const conversations = await db.query.conversationSchema.findMany({
    where: eq(conversationSchema.organizationId, orgId),
    orderBy: (conv, { desc }) => [desc(conv.lastMessageAt)],
  });

  // Check if any platforms are integrated
  const integrations = await db.query.integrationSchema.findMany({
    where: eq(integrationSchema.organizationId, orgId),
  });

  const hasIntegrations = integrations.length > 0;

  return (
    <InboxClient
      initialConversations={JSON.parse(JSON.stringify(conversations))}
      isAr={locale === 'ar'}
      hasIntegrations={hasIntegrations}
    />
  );
}

export const dynamic = 'force-dynamic';
