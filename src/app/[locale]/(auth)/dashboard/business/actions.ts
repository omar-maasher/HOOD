'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { businessProfileSchema, organizationSchema } from '@/models/Schema';

export async function getBusinessProfile() {
  const { orgId } = await auth();
  if (!orgId) return null;

  // Ensure org exists
  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const [profile] = await db
    .select()
    .from(businessProfileSchema)
    .where(eq(businessProfileSchema.organizationId, orgId));

  return profile || null;
}

export async function saveBusinessProfile(data: any) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const existingProfile = await getBusinessProfile();

  if (existingProfile) {
    const [updated] = await db.update(businessProfileSchema)
      .set({
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        phoneNumber: data.phoneNumber,
        address: data.address,
        workingHours: data.workingHours,
        policies: data.policies,
        paymentMethods: data.paymentMethods,
        bankAccounts: data.bankAccounts,
      })
      .where(eq(businessProfileSchema.organizationId, orgId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db.insert(businessProfileSchema)
      .values({
        organizationId: orgId,
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        phoneNumber: data.phoneNumber,
        address: data.address,
        workingHours: data.workingHours,
        policies: data.policies,
        paymentMethods: data.paymentMethods,
        bankAccounts: data.bankAccounts,
      })
      .returning();
    return inserted;
  }
}
