'use server';

import { currentUser } from '@clerk/nextjs/server';
import { count, desc, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { integrationSchema, leadSchema, organizationSchema, productSchema } from '@/models/Schema';

/**
 * Security Check: Ensures the caller is a Super Admin.
 * You can define super admin emails in your .env
 */
async function checkSuperAdmin() {
  const user = await currentUser();
  const emails = (process.env.SUPER_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

  if (!user || !user.emailAddresses.some(e => emails.includes(e.emailAddress))) {
    throw new Error('Unauthorized: Super Admin access required');
  }
}

export async function getAdminStats() {
  await checkSuperAdmin();

  const [orgCount] = await db.select({ value: count() }).from(organizationSchema);
  const [leadCount] = await db.select({ value: count() }).from(leadSchema);
  const [integrationCount] = await db.select({ value: count() }).from(integrationSchema);

  // Get subscription counts
  const [activeSubs] = await db.select({ value: count() })
    .from(organizationSchema)
    .where(eq(organizationSchema.stripeSubscriptionStatus, 'active'));

  return {
    totalOrgs: Number(orgCount?.value || 0),
    totalLeads: Number(leadCount?.value || 0),
    totalIntegrations: Number(integrationCount?.value || 0),
    activeSubscriptions: Number(activeSubs?.value || 0),
  };
}

export async function getAllOrganizations() {
  await checkSuperAdmin();

  // Aggregate counts using subqueries or separate queries for simplicity/safety
  const orgs = await db.select()
    .from(organizationSchema)
    .orderBy(desc(organizationSchema.createdAt));

  const results = await Promise.all(orgs.map(async (org) => {
    const [leadResult] = await db.select({ value: count() }).from(leadSchema).where(eq(leadSchema.organizationId, org.id));
    const [productResult] = await db.select({ value: count() }).from(productSchema).where(eq(productSchema.organizationId, org.id));
    const [integrationResult] = await db.select({ value: count() }).from(integrationSchema).where(eq(integrationSchema.organizationId, org.id));

    return {
      id: org.id,
      planId: org.planId,
      stripeSubscriptionStatus: org.stripeSubscriptionStatus,
      createdAt: org.createdAt instanceof Date ? org.createdAt.toISOString() : String(org.createdAt),
      updatedAt: org.updatedAt instanceof Date ? org.updatedAt.toISOString() : String(org.updatedAt),
      leadsCount: Number(leadResult?.value || 0),
      productsCount: Number(productResult?.value || 0),
      integrationsCount: Number(integrationResult?.value || 0),
    };
  }));

  return results;
}

export async function updateOrganizationSubscription(orgId: string, planId: string, status: string) {
  await checkSuperAdmin();

  await db.update(organizationSchema)
    .set({
      planId,
      stripeSubscriptionStatus: status,
      updatedAt: new Date(),
    })
    .where(eq(organizationSchema.id, orgId));

  return { success: true };
}
