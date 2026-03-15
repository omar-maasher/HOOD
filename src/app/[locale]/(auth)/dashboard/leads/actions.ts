'use server';

import { auth } from '@clerk/nextjs/server';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { sendInstagramMessage, sendMessengerMessage, sendWaTemplate, sendWhatsAppMessage } from '@/libs/Meta';
import { integrationSchema, leadSchema, organizationSchema, waTemplateSchema } from '@/models/Schema';

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

export async function getTemplates() {
  const { orgId } = await auth();
  if (!orgId) {
    return [];
  }

  // Fetch approved templates from local DB
  return db.select()
    .from(waTemplateSchema)
    .where(and(
      eq(waTemplateSchema.organizationId, orgId),
      eq(waTemplateSchema.metaStatus, 'APPROVED'),
    ));
}

export async function sendMessage(data: {
  leadId: number;
  type: 'text' | 'template';
  platform: 'whatsapp' | 'instagram' | 'messenger';
  text?: string;
  templateName?: string;
  language?: string;
}) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // 1. Fetch Lead
  const lead = await db.query.leadSchema.findFirst({
    where: and(eq(leadSchema.id, data.leadId), eq(leadSchema.organizationId, orgId)),
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  // 2. Fetch Integration
  const integration = await db.query.integrationSchema.findFirst({
    where: and(eq(integrationSchema.organizationId, orgId), eq(integrationSchema.type, data.platform)),
  });

  if (!integration || !integration.accessToken) {
    throw new Error(`No ${data.platform} integration found`);
  }

  const token = integration.accessToken;
  const providerId = integration.providerId;

  // 3. Send Message
  if (data.platform === 'whatsapp') {
    // For WhatsApp, we might need phoneNumberId from config
    let phoneNumberId = providerId;
    if (integration.config) {
      try {
        const configObj = JSON.parse(integration.config);
        if (configObj.phoneNumberId) {
          phoneNumberId = configObj.phoneNumberId;
        }
      } catch {}
    }

    if (!phoneNumberId) {
      throw new Error('WhatsApp Phone Number ID not found');
    }

    if (data.type === 'template') {
      if (!data.templateName) {
        throw new Error('Template name is required');
      }
      const phone = lead.contactMethod.replace(/\D/g, '');
      return sendWaTemplate(phoneNumberId, phone, data.templateName, data.language || 'ar', token);
    }
    const phone = lead.contactMethod.replace(/\D/g, '');
    return sendWhatsAppMessage(phoneNumberId, phone, data.text || '', token);
  }

  if (data.platform === 'instagram') {
    // For IG, we need the Page ID (stored in config or providerId)
    let pageId = providerId;
    if (integration.config) {
      try {
        const configObj = JSON.parse(integration.config);
        if (configObj.pageId) {
          pageId = configObj.pageId;
        }
      } catch {}
    }
    if (!pageId) {
      throw new Error('Instagram Page ID not found');
    }
    return sendInstagramMessage(pageId, lead.contactMethod, data.text || '', token);
  }

  if (data.platform === 'messenger') {
    if (!providerId) {
      throw new Error('Messenger Page ID not found');
    }
    return sendMessengerMessage(providerId, lead.contactMethod, data.text || '', token);
  }

  throw new Error('Unsupported platform');
}
