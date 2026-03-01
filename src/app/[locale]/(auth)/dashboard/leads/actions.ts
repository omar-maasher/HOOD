'use server';

import { auth } from '@clerk/nextjs/server';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { leadSchema, organizationSchema } from '@/models/Schema';

export async function getLeads() {
  const { orgId } = await auth();
  if (!orgId) {
    return [];
  }

  const leads = await db
    .select()
    .from(leadSchema)
    .where(eq(leadSchema.organizationId, orgId))
    .orderBy(desc(leadSchema.createdAt));

  return leads.map((l: any) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));
}

export async function createLead(data: any) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const [newLead] = await db.insert(leadSchema).values({
    organizationId: orgId,
    name: data.name,
    contactMethod: data.contactMethod,
    source: data.source,
    status: data.status,
    notes: data.notes,
  }).returning();

  return {
    ...newLead,
    createdAt: newLead?.createdAt.toISOString(),
    updatedAt: newLead?.updatedAt.toISOString(),
  };
}

export async function updateLead(id: number, data: any) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const [updated] = await db.update(leadSchema)
    .set({
      name: data.name,
      contactMethod: data.contactMethod,
      source: data.source,
      status: data.status,
      notes: data.notes,
    })
    .where(and(eq(leadSchema.id, id), eq(leadSchema.organizationId, orgId)))
    .returning();

  return {
    ...updated,
    createdAt: updated?.createdAt.toISOString(),
    updatedAt: updated?.updatedAt.toISOString(),
  };
}

export async function deleteLead(id: number) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  await db.delete(leadSchema)
    .where(and(eq(leadSchema.id, id), eq(leadSchema.organizationId, orgId)));

  return true;
}
