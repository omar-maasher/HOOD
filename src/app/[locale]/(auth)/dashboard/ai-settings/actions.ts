'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { aiSettingsSchema, organizationSchema } from '@/models/Schema';

export async function getAiSettings() {
  const { orgId } = await auth();
  if (!orgId) return null;

  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const [settings] = await db
    .select()
    .from(aiSettingsSchema)
    .where(eq(aiSettingsSchema.organizationId, orgId));

  if (!settings) return null;
  return { 
    ...settings, 
    faqs: settings.faqs || [],
    tone: settings.tone || '',
    escalationRules: settings.escalationRules || '',
    welcomeMessage: settings.welcomeMessage || '',
    workingHours: settings.workingHours || { enabled: false, start: '09:00', end: '17:00', outOfHoursMessage: 'عذراً، نحن خارج أوقات العمل حالياً. سنقوم بالرد عليك في أقرب وقت.' },
    antiSpam: settings.antiSpam || { enabled: true, maxMessagesPerWindow: 3, windowMinutes: 5, warningMessage: 'تم استلام طلبك، يرجى الانتظار قليلاً لتجنب تكرار الرسائل.' }
  };
}

export async function saveAiSettings(data: any) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const [existingSettings] = await db
    .select()
    .from(aiSettingsSchema)
    .where(eq(aiSettingsSchema.organizationId, orgId));

  const values = {
    organizationId: orgId,
    isActive: data.isActive,
    botName: data.botName,
    systemPrompt: data.systemPrompt,
    tone: data.tone,
    escalationRules: data.escalationRules,
    faqs: data.faqs || [],
    welcomeMessage: data.welcomeMessage,
    workingHours: data.workingHours,
    antiSpam: data.antiSpam,
  };

  if (existingSettings) {
    const [updated] = await db.update(aiSettingsSchema)
      .set(values)
      .where(eq(aiSettingsSchema.organizationId, orgId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db.insert(aiSettingsSchema)
      .values(values)
      .returning();
    return inserted;
  }
}
