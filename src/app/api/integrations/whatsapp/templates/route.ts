import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { createWaTemplate, listWaTemplates } from '@/libs/Meta';
import { integrationSchema, waTemplateSchema } from '@/models/Schema';

const getWAIntegration = async (orgId: string) => {
  return db.query.integrationSchema.findFirst({
    where: and(eq(integrationSchema.organizationId, orgId), eq(integrationSchema.type, 'whatsapp')),
  });
};

// GET - list templates from Meta + local DB
export const GET = async (_req: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const integration = await getWAIntegration(orgId);
  if (!integration) {
    return NextResponse.json({ error: 'No WhatsApp integration found' }, { status: 404 });
  }

  const config = JSON.parse(integration.config || '{}');
  const wabaId = integration.providerId;

  try {
    const metaTemplates = await listWaTemplates(wabaId || '', integration.accessToken || '');
    return NextResponse.json({ templates: metaTemplates.data || [], wabaId, phoneNumberId: config.phoneNumberId });
  } catch (err: any) {
    logger.error(err, 'Failed to list WA templates');
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// POST - create template on Meta + save locally
export const POST = async (req: Request) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const integration = await getWAIntegration(orgId);
  if (!integration) {
    return NextResponse.json({ error: 'No WhatsApp integration found' }, { status: 404 });
  }

  const wabaId = integration.providerId;
  const body = await req.json();
  const { name, language, category, headerText, bodyText, footerText, buttons } = body;

  if (!name || !category || !bodyText) {
    return NextResponse.json({ error: 'name, category, and bodyText are required' }, { status: 400 });
  }

  try {
    const metaResult = await createWaTemplate({
      wabaId: wabaId || '',
      accessToken: integration.accessToken || '',
      name,
      language: language || 'ar',
      category,
      headerText,
      bodyText,
      footerText,
      buttons,
    });

    await db.insert(waTemplateSchema).values({
      organizationId: orgId,
      name,
      language: language || 'ar',
      category,
      headerText,
      bodyText,
      footerText,
      buttons,
      metaStatus: metaResult.status || 'PENDING',
      metaTemplateId: metaResult.id,
    });

    return NextResponse.json({ success: true, id: metaResult.id, status: metaResult.status });
  } catch (err: any) {
    logger.error(err, 'Failed to create WA template');
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
