'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { businessProfileSchema, organizationSchema } from '@/models/Schema';

export async function getBusinessProfile() {
  const { orgId } = await auth();
  if (!orgId) {
    return null;
  }

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
  if (!orgId) {
    throw new Error('Unauthorized');
  }

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
        storeLatitude: data.storeLatitude,
        storeLongitude: data.storeLongitude,
        deliveryPricePerKm: data.deliveryPricePerKm,
        isDeliveryEnabled: data.isDeliveryEnabled,
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
        storeLatitude: data.storeLatitude,
        storeLongitude: data.storeLongitude,
        deliveryPricePerKm: data.deliveryPricePerKm,
        isDeliveryEnabled: data.isDeliveryEnabled,
      })
      .returning();
    return inserted;
  }
}

export async function scrapeBusinessInfo(url: string) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // Replace this with the actual n8n webhook URL
  const N8N_AI_READER_WEBHOOK = process.env.N8N_AI_READER_WEBHOOK || 'http://localhost:5678/webhook/ai-reader';

  try {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;

    // Ask N8N AI to read the website
    const res = await fetch(N8N_AI_READER_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl, intent: 'business_info' }),
    });

    if (!res.ok) {
      throw new Error('Failed to reach N8N Webhook');
    }

    const data = await res.json();

    return {
      businessName: data.businessName || '',
      businessDescription: data.businessDescription || '',
      phoneNumber: data.phoneNumber || '',
    };
  } catch (error) {
    console.error('Error auto-filling business via n8n:', error);
    return { error: 'فشل الاتصال بمحرك n8n لقراءة الموقع. تأكد من إعداد Webhook الخاص بك.' };
  }
}
