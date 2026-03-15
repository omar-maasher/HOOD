import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { deleteWaTemplate } from '@/libs/Meta';
import { integrationSchema, waTemplateSchema } from '@/models/Schema';

export const DELETE = async (_req: Request, { params }: { params: Promise<{ name: string }> }) => {
  const { orgId } = await auth();
  if (!orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { name } = await params;

  const integration = await db.query.integrationSchema.findFirst({
    where: and(eq(integrationSchema.organizationId, orgId), eq(integrationSchema.type, 'whatsapp')),
  });
  if (!integration) {
    return NextResponse.json({ error: 'No WhatsApp integration found' }, { status: 404 });
  }

  try {
    await deleteWaTemplate(integration.providerId || '', name, integration.accessToken || '');
    await db.delete(waTemplateSchema).where(
      and(eq(waTemplateSchema.organizationId, orgId), eq(waTemplateSchema.name, name)),
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.error(err, 'Failed to delete WA template');
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
