'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';

export async function getApiKey() {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const org = await db.query.organizationSchema.findFirst({
    where: eq(organizationSchema.id, orgId),
  });

  return org?.apiKey;
}

export async function generateApiKey() {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const newKey = `hood_${uuidv4().replace(/-/g, '')}`;

  await db.update(organizationSchema)
    .set({ apiKey: newKey })
    .where(eq(organizationSchema.id, orgId));

  revalidatePath('/dashboard/ai-settings');
  return newKey;
}
