import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';

/**
 * TEMPORARY DEBUG ENDPOINT - REMOVE AFTER DEBUGGING
 * GET /api/meta/debug?orgId=YOUR_ORG_ID
 *
 * Checks:
 * 1. What's stored in DB (providerId, token prefix)
 * 2. Whether the stored token is valid and has required permissions
 * 3. Whether the providerId is a Page or an Instagram account
 */
export const GET = async (request: Request) => {
  // Basic auth check
  const authHeader = request.headers.get('Authorization');
  const secretToken = process.env.INTERNAL_API_SECRET;
  if (!secretToken || authHeader !== `Bearer ${secretToken}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId');

  if (!orgId) {
    return NextResponse.json({ error: 'Missing orgId param' }, { status: 400 });
  }

  // 1. Fetch the integration from DB
  const integration = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.organizationId, orgId),
      eq(integrationSchema.type, 'instagram'),
    ),
  });

  if (!integration) {
    return NextResponse.json({ error: 'No instagram integration found for this orgId' }, { status: 404 });
  }

  const { providerId, accessToken } = integration;
  const tokenPrefix = accessToken ? `${accessToken.substring(0, 10)}...` : 'MISSING';

  const results: Record<string, unknown> = {
    db: {
      providerId,
      tokenPrefix,
      status: integration.status,
    },
  };

  if (!accessToken || !providerId) {
    return NextResponse.json({ ...results, error: 'Missing token or providerId in DB' });
  }

  // 2. Check if providerId is a Facebook Page (correct) or Instagram account
  try {
    const pageCheckRes = await fetch(
      `https://graph.facebook.com/v21.0/${providerId}?fields=id,name,category&access_token=${accessToken}`,
    );
    const pageCheckData = await pageCheckRes.json();
    results.pageCheck = pageCheckData;
    results.isPage = !pageCheckData.error && !!pageCheckData.category;
  } catch (e) {
    results.pageCheckError = String(e);
  }

  // 3. Check token permissions/scopes
  try {
    const tokenInfoRes = await fetch(
      `https://graph.facebook.com/v21.0/me/permissions?access_token=${accessToken}`,
    );
    const tokenInfoData = await tokenInfoRes.json();
    results.tokenPermissions = tokenInfoData;
  } catch (e) {
    results.tokenPermissionsError = String(e);
  }

  // 4. Check if instagram_manage_messages is granted
  try {
    const debugTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/debug_token?input_token=${accessToken}&access_token=${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`,
    );
    const debugTokenData = await debugTokenRes.json();
    results.tokenDebug = debugTokenData;
  } catch (e) {
    results.tokenDebugError = String(e);
  }

  return NextResponse.json(results, { status: 200 });
};
