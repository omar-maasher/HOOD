import { auth } from '@clerk/nextjs/server';
import { and, eq, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';

export const POST = async (request: Request) => {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { platform } = await request.json();

    if (platform === 'instagram' || platform === 'messenger') {
      // Delete the specific selected integration
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, platform),
        ),
      );

      // If neither instagram nor messenger exist, delete facebook_root
      const remainingMeta = await db.query.integrationSchema.findFirst({
        where: and(
          eq(integrationSchema.organizationId, orgId),
          or(
            eq(integrationSchema.type, 'instagram'),
            eq(integrationSchema.type, 'messenger'),
          ),
        ),
      });
      if (!remainingMeta) {
        await db.delete(integrationSchema).where(
          and(eq(integrationSchema.organizationId, orgId), eq(integrationSchema.type, 'facebook_root')),
        );
      }
    } else if (platform === 'whatsapp') {
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, 'whatsapp'),
        ),
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Disconnect Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
