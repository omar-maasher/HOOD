import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';

export async function POST(req: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Token missing' }, { status: 400 });

    const org = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, orgId),
    });

    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const currentTokens = org.expoPushTokens || [];
    if (!currentTokens.includes(token)) {
      await db.update(organizationSchema)
        .set({ expoPushTokens: [...currentTokens, token] })
        .where(eq(organizationSchema.id, orgId));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
