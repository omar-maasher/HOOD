import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getMetaAuthUrl } from '@/libs/Meta';

export const GET = async () => {
  const { orgId, userId } = await auth();

  if (!orgId || !userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // State can be used to pass the orgId safely
  const state = JSON.stringify({ orgId, userId });
  const authUrl = getMetaAuthUrl(Buffer.from(state).toString('base64'));

  return NextResponse.redirect(authUrl);
};
