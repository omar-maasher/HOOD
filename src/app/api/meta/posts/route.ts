import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { getFacebookPagePostsList, getInstagramMediaList } from '@/libs/Meta';
import { integrationSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const platform = (searchParams.get('platform') || 'instagram').toLowerCase();
  const limit = Math.min(Math.max(Number(searchParams.get('limit') || 24), 1), 50);

  try {
    if (platform === 'instagram') {
      const integration = await db.query.integrationSchema.findFirst({
        where: and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, 'instagram'),
          eq(integrationSchema.status, 'active'),
        ),
      });

      if (!integration?.accessToken) {
        return NextResponse.json({ items: [], error: 'INSTAGRAM_NOT_CONNECTED' }, { status: 404 });
      }

      let igAccountId: string | undefined;
      let isDirectLogin = false;
      if (integration.config) {
        try {
          const cfg = JSON.parse(integration.config);
          igAccountId = cfg?.igAccountId?.toString?.();
          isDirectLogin = cfg?.method === 'instagram_direct';
        } catch {
          // ignore
        }
      }

      if (!igAccountId) {
        // Fallback to providerId (might be the IG account id in direct mode)
        igAccountId = integration.providerId || undefined;
      }

      if (!igAccountId) {
        return NextResponse.json({ items: [], error: 'INSTAGRAM_ACCOUNT_MISSING' }, { status: 400 });
      }

      const items = await getInstagramMediaList(igAccountId, integration.accessToken, limit, isDirectLogin);
      return NextResponse.json({ items });
    }

    if (platform === 'facebook' || platform === 'messenger') {
      const integration = await db.query.integrationSchema.findFirst({
        where: and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, 'messenger'),
          eq(integrationSchema.status, 'active'),
        ),
      });

      if (!integration?.accessToken || !integration.providerId) {
        return NextResponse.json({ items: [], error: 'FACEBOOK_NOT_CONNECTED' }, { status: 404 });
      }

      const items = await getFacebookPagePostsList(integration.providerId, integration.accessToken, limit);
      return NextResponse.json({ items });
    }

    return NextResponse.json({ items: [], error: 'UNSUPPORTED_PLATFORM' }, { status: 400 });
  } catch (error) {
    console.error('Failed to fetch posts list', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
