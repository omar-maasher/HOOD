import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';
import { eq, and, or } from 'drizzle-orm';

export const POST = async (request: Request) => {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { platform } = await request.json();

    if (platform === 'instagram' || platform === 'messenger') {
      // Delete all Meta-related integrations to reset the connection completely
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          or(
            eq(integrationSchema.type, 'facebook_root'),
            eq(integrationSchema.type, 'instagram'),
            eq(integrationSchema.type, 'messenger')
          )
        )
      );
    } else if (platform === 'whatsapp') {
      await db.delete(integrationSchema).where(
        and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, 'whatsapp')
        )
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Disconnect Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
