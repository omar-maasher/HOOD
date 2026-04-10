import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { messageSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId');

  if (!orgId) {
    return NextResponse.json({ error: 'Missing orgId param' }, { status: 400 });
  }

  try {
    const messages = await db.select()
      .from(messageSchema)
      .where(eq(messageSchema.organizationId, orgId))
      .orderBy(desc(messageSchema.createdAt))
      .limit(30);

    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
