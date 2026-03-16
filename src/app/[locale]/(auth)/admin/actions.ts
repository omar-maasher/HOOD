'use server';

import { currentUser } from '@clerk/nextjs/server';
import { count, desc, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import {
  aiSettingsSchema,
  bookingSchema,
  businessProfileSchema,
  integrationSchema,
  leadSchema,
  organizationSchema,
  productSchema,
  waTemplateSchema,
} from '@/models/Schema';

/**
 * Security Check: Ensures the caller is a Super Admin.
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

  const orgs = await db.select()
    .from(organizationSchema)
    .orderBy(desc(organizationSchema.createdAt));

  const results = await Promise.all(orgs.map(async (org) => {
    const [leadResult] = await db.select({ value: count() }).from(leadSchema).where(eq(leadSchema.organizationId, org.id));
    const [productResult] = await db.select({ value: count() }).from(productSchema).where(eq(productSchema.organizationId, org.id));
    const [integrationResult] = await db.select({ value: count() }).from(integrationSchema).where(eq(integrationSchema.organizationId, org.id));
    const [businessProfile] = await db.select({ name: businessProfileSchema.businessName }).from(businessProfileSchema).where(eq(businessProfileSchema.organizationId, org.id));

    return {
      id: org.id,
      businessName: businessProfile?.name || 'Unnamed Business',
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

export async function deleteOrganization(orgId: string) {
  await checkSuperAdmin();

  // Order of deletion to respect foreign keys (if CASCADE is not fully set in DB)
  await db.delete(leadSchema).where(eq(leadSchema.organizationId, orgId));
  await db.delete(productSchema).where(eq(productSchema.organizationId, orgId));
  await db.delete(integrationSchema).where(eq(integrationSchema.organizationId, orgId));
  await db.delete(businessProfileSchema).where(eq(businessProfileSchema.organizationId, orgId));
  await db.delete(aiSettingsSchema).where(eq(aiSettingsSchema.organizationId, orgId));
  await db.delete(bookingSchema).where(eq(bookingSchema.organizationId, orgId));
  await db.delete(waTemplateSchema).where(eq(waTemplateSchema.organizationId, orgId));

  // Finally delete the organization
  await db.delete(organizationSchema)
    .where(eq(organizationSchema.id, orgId));

  return { success: true };
}

export async function getOrganizationDeepSettings(orgId: string) {
  await checkSuperAdmin();

  const [aiSettings] = await db.select().from(aiSettingsSchema).where(eq(aiSettingsSchema.organizationId, orgId));
  const [profile] = await db.select().from(businessProfileSchema).where(eq(businessProfileSchema.organizationId, orgId));

  return {
    ai: aiSettings || null,
    profile: profile || null,
  };
}

export async function updateOrganizationDeepSettings(orgId: string, data: {
  botName?: string;
  systemPrompt?: string;
  businessName?: string;
  businessDescription?: string;
}) {
  await checkSuperAdmin();

  if (data.botName !== undefined || data.systemPrompt !== undefined) {
    await db.update(aiSettingsSchema)
      .set({
        ...(data.botName !== undefined && { botName: data.botName }),
        ...(data.systemPrompt !== undefined && { systemPrompt: data.systemPrompt }),
        updatedAt: new Date(),
      })
      .where(eq(aiSettingsSchema.organizationId, orgId));
  }

  if (data.businessName !== undefined || data.businessDescription !== undefined) {
    await db.update(businessProfileSchema)
      .set({
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.businessDescription !== undefined && { businessDescription: data.businessDescription }),
        updatedAt: new Date(),
      })
      .where(eq(businessProfileSchema.organizationId, orgId));
  }

  return { success: true };
}
