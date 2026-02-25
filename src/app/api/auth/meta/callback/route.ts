import { NextResponse } from 'next/server';
import { exchangeCodeForToken, getLongLivedToken } from '@/libs/Meta';
import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateBase64 = searchParams.get('state');

  if (!code || !stateBase64) {
    return NextResponse.redirect(new URL('/dashboard/integrations?error=missing_params', request.url));
  }

  try {
    const state = JSON.parse(Buffer.from(stateBase64, 'base64').toString());
    const { orgId } = state;

    // Exchange short-lived code for token
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (tokenResponse.error) {
      console.error('Meta Token Exchange Error:', tokenResponse.error);
      return NextResponse.redirect(new URL('/dashboard/integrations?error=token_exchange_failed', request.url));
    }

    // Get long-lived token (60 days)
    const longLivedResponse = await getLongLivedToken(tokenResponse.access_token);
    const accessToken = longLivedResponse.access_token || tokenResponse.access_token;

    // Here you would normally fetch the user's pages and let them choose
    // For now, we just save the main token for the organization
    // We'll tag it as 'facebook' which can then be used to list pages/instagram/etc.
    
    await db.insert(integrationSchema).values({
      organizationId: orgId,
      type: 'facebook_root',
      accessToken: accessToken,
      status: 'active',
    }).onConflictDoUpdate({
      target: [integrationSchema.organizationId, integrationSchema.type],
      set: { accessToken, updatedAt: new Date() }
    });

    return NextResponse.redirect(new URL('/dashboard/integrations?success=connected', request.url));
  } catch (error) {
    console.error('Meta Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/integrations?error=server_error', request.url));
  }
};
