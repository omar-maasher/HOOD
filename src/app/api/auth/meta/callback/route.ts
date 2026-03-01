import { Buffer } from 'node:buffer';

import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { exchangeCodeForToken, getLongLivedToken } from '@/libs/Meta';
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
    const { orgId, platform } = state;

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

    // Check if the integration already exists
    const existingIntegration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, 'facebook_root'),
      ),
    });

    if (existingIntegration) {
      await db.update(integrationSchema)
        .set({ accessToken, updatedAt: new Date() })
        .where(
          and(
            eq(integrationSchema.organizationId, orgId),
            eq(integrationSchema.type, 'facebook_root'),
          ),
        );
    } else {
      await db.insert(integrationSchema).values({
        organizationId: orgId,
        type: 'facebook_root',
        accessToken,
        status: 'active',
      });
    }

    // CREATE DISPLAY RECORD BASED ON PLATFORM CLICKED
    if (platform === 'messenger') {
      const existingMsg = await db.query.integrationSchema.findFirst({
        where: and(
          eq(integrationSchema.organizationId, orgId),
          eq(integrationSchema.type, 'messenger'),
        ),
      });

      if (existingMsg) {
        await db.update(integrationSchema)
          .set({ accessToken, updatedAt: new Date() })
          .where(
            and(
              eq(integrationSchema.organizationId, orgId),
              eq(integrationSchema.type, 'messenger'),
            ),
          );
      } else {
        await db.insert(integrationSchema).values({
          organizationId: orgId,
          type: 'messenger',
          accessToken,
          status: 'active',
        });
      }
    } else if (platform === 'instagram') {
      // --- AUTO FETCH PAGES AND INSTAGRAM ACCOUNT ---
      try {
        const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();

          // Loop through all pages to see if they have an Instagram Business account connected
          for (const page of pagesData.data || []) {
            const pageToken = page.access_token;
            const pageId = page.id;

            const igRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
            if (igRes.ok) {
              const igData = await igRes.json();

              // If the page has an Instagram account connected
              if (igData.instagram_business_account) {
                const igAccountId = igData.instagram_business_account.id;

                const existingIg = await db.query.integrationSchema.findFirst({
                  where: and(
                    eq(integrationSchema.organizationId, orgId),
                    eq(integrationSchema.type, 'instagram'),
                  ),
                });

                if (existingIg) {
                  await db.update(integrationSchema)
                    .set({
                      accessToken: pageToken,
                      providerId: igAccountId, // Instagram Account ID (needed for Webhook)
                      config: JSON.stringify({ pageId }), // Facebook Page ID (needed for Sending Messages)
                      updatedAt: new Date(),
                    })
                    .where(
                      and(
                        eq(integrationSchema.organizationId, orgId),
                        eq(integrationSchema.type, 'instagram'),
                      ),
                    );
                } else {
                  await db.insert(integrationSchema).values({
                    organizationId: orgId,
                    type: 'instagram',
                    providerId: igAccountId,
                    accessToken: pageToken,
                    config: JSON.stringify({ pageId }),
                    status: 'active',
                  });
                }

                // Only auto-connect the first found one for now
                break;
              }
            }
          }
        }
      } catch (e) {
        console.error('Auto-connect Instagram Error:', e);
      }
    }

    return NextResponse.redirect(new URL(`/dashboard/integrations?success=connected`, request.url));
  } catch (error) {
    console.error('Meta Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/integrations?error=server_error', request.url));
  }
};
