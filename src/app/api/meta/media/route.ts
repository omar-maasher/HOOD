import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { getInstagramMedia } from '@/libs/Meta';
import { integrationSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get('mediaId');

  if (!mediaId) {
    return new NextResponse('Missing mediaId', { status: 400 });
  }

  // Find the instagram integration to get the access token
  const integration = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.organizationId, orgId),
      eq(integrationSchema.type, 'instagram'),
    ),
  });

  if (!integration || !integration.accessToken) {
    return new NextResponse('Instagram integration not found', { status: 404 });
  }

  try {
    const data = await getInstagramMedia(mediaId, integration.accessToken);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch media details', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
