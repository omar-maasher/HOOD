'use server';

import { currentUser } from '@clerk/nextjs/server';
import { count, desc, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { integrationSchema, leadSchema, organizationSchema } from '@/models/Schema';

/**
 * Security Check: Ensures the caller is a Super Admin.
 * You can define super admin emails in your .env
 */
async function checkSuperAdmin() {
  const user = await currentUser();
  const emails = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];

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
  const activeSubs = await db.select({ value: count() })
    .from(organizationSchema)
    .where(eq(organizationSchema.stripeSubscriptionStatus, 'active'));

  return {
    totalOrgs: orgCount?.value || 0,
    totalLeads: leadCount?.value || 0,
    totalIntegrations: integrationCount?.value || 0,
    activeSubscriptions: activeSubs[0]?.value || 0,
  };
}

export async function getAllOrganizations() {
  await checkSuperAdmin();

  return db.select()
    .from(organizationSchema)
    .orderBy(desc(organizationSchema.createdAt));
}
