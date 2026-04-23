import { db } from '../src/libs/DB';
import { messageSchema, conversationSchema } from '../src/models/Schema';
import { eq, desc, and } from 'drizzle-orm';

async function checkRecentActivity() {
  console.log('--- Checking Recent Activity for ordery.store ---');
  // Organization ID for ordery.store is org_3BgH8VR93zasR2j28P9nzt0X1eF
  const orgId = 'org_3BgH8VR93zasR2j28P9nzt0X1eF';
  
  const conversations = await db.select().from(conversationSchema).where(eq(conversationSchema.organizationId, orgId)).orderBy(desc(conversationSchema.lastMessageAt)).limit(5);
  
  if (conversations.length === 0) {
    console.log('No conversations found for this organization.');
    return;
  }

  for (const c of conversations) {
    console.log(`- Conversation ID: ${c.id}`);
    console.log(`  Platform: ${c.platform}`);
    console.log(`  Customer: ${c.customerName}`);
    console.log(`  Last Message: ${c.lastMessage}`);
    console.log(`  At: ${c.lastMessageAt}`);
    console.log('---------------------------');
  }
}

checkRecentActivity().catch(console.error);
