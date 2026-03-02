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
  const platform = searchParams.get('platform') as any; // Cast for now to match the new type
  const locale = searchParams.get('locale') || 'ar';

  // State can be used to pass the orgId safely
  const state = JSON.stringify({ orgId, userId, platform, locale });
  const authUrl = getMetaAuthUrl(Buffer.from(state).toString('base64'), platform || undefined);

  return NextResponse.redirect(authUrl);
};
