import { Buffer } from 'node:buffer';

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getMetaAuthUrl } from '@/libs/Meta';

export const GET = async (request: Request) => {
  const { orgId, userId } = await auth();

  if (!orgId || !userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');

  // State can be used to pass the orgId safely
  const state = JSON.stringify({ orgId, userId, platform });
  const authUrl = getMetaAuthUrl(Buffer.from(state).toString('base64'));

  return NextResponse.redirect(authUrl);
};
