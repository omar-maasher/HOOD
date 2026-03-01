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
      try {
        const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          // Pick the first page the user connected
          if (pagesData.data && pagesData.data.length > 0) {
            const page = pagesData.data[0];
            const pageToken = page.access_token;
            const pageId = page.id; // This is the ID that Webhooks use!

            const existingMsg = await db.query.integrationSchema.findFirst({
              where: and(
                eq(integrationSchema.organizationId, orgId),
                eq(integrationSchema.type, 'messenger'),
              ),
            });

            if (existingMsg) {
              await db.update(integrationSchema)
                .set({
                  accessToken: pageToken,
                  providerId: pageId,
                  updatedAt: new Date(),
                })
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
                providerId: pageId,
                accessToken: pageToken,
                status: 'active',
              });
            }
          }
        }
      } catch (e) {
        console.error('Auto-connect Messenger Error:', e);
      }
    } else if (platform === 'instagram') {
      // --- AUTO FETCH PAGES AND INSTAGRAM ACCOUNT ---
      try {
        // eslint-disable-next-line no-console
        console.log('Starting Instagram account discovery...');
        const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
        if (!pagesRes.ok) {
          const error = await pagesRes.json();

          console.error('Failed to fetch Facebook pages:', error);
          throw new Error('Failed to fetch Facebook pages');
        }

        const pagesData = await pagesRes.json();
        // eslint-disable-next-line no-console
        console.log(`Found ${pagesData.data?.length || 0} pages to check.`);

        let accountFound = false;

        // Loop through all pages to see if they have an Instagram Business account connected
        for (const page of pagesData.data || []) {
          const pageToken = page.access_token;
          const pageId = page.id;
          // eslint-disable-next-line no-console
          console.log(`Checking page: ${page.name} (${pageId})`);

          const igRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
          if (igRes.ok) {
            const igData = await igRes.json();
            // eslint-disable-next-line no-console
            console.log(`Page ${page.name} IG result:`, igData);

            // If the page has an Instagram account connected
            if (igData.instagram_business_account) {
              const igAccountId = igData.instagram_business_account.id;
              // eslint-disable-next-line no-console
              console.log(`Found Instagram account: ${igAccountId}`);

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
                    providerId: igAccountId,
                    config: JSON.stringify({ pageId, pageName: page.name }),
                    status: 'active',
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
                  config: JSON.stringify({ pageId, pageName: page.name }),
                  status: 'active',
                });
              }

              accountFound = true;
              break;
            }
          } else {
            const igError = await igRes.json();

            console.error(`Failed to check IG for page ${pageId}:`, igError);
          }
        }

        if (!accountFound) {
          console.warn('No Instagram Business Account was found linked to any of the connected pages.');
          return NextResponse.redirect(new URL('/dashboard/integrations?error=no_instagram_account', request.url));
        }
      } catch (e) {
        console.error('Auto-connect Instagram Error:', e);
      }
    } else if (platform === 'whatsapp') {
      try {
        const businessesRes = await fetch(`https://graph.facebook.com/v21.0/me/businesses?access_token=${accessToken}`);
        if (businessesRes.ok) {
          const businessesData = await businessesRes.json();
          for (const business of businessesData.data || []) {
            const wabaRes = await fetch(`https://graph.facebook.com/v21.0/${business.id}/whatsapp_business_accounts?access_token=${accessToken}`);
            if (wabaRes.ok) {
              const wabaData = await wabaRes.json();
              if (wabaData.data && wabaData.data.length > 0) {
                const waba = wabaData.data[0];
                const wabaId = waba.id;

                const existingWa = await db.query.integrationSchema.findFirst({
                  where: and(
                    eq(integrationSchema.organizationId, orgId),
                    eq(integrationSchema.type, 'whatsapp'),
                  ),
                });

                if (existingWa) {
                  await db.update(integrationSchema)
                    .set({
                      accessToken,
                      providerId: wabaId,
                      updatedAt: new Date(),
                    })
                    .where(and(
                      eq(integrationSchema.organizationId, orgId),
                      eq(integrationSchema.type, 'whatsapp'),
                    ));
                } else {
                  await db.insert(integrationSchema).values({
                    organizationId: orgId,
                    type: 'whatsapp',
                    providerId: wabaId,
                    accessToken,
                    status: 'active',
                  });
                }
                break;
              }
            }
          }
        }
      } catch (e) {
        console.error('Auto-connect WhatsApp Error:', e);
      }
    }

    return NextResponse.redirect(new URL(`/dashboard/integrations?success=connected`, request.url));
  } catch (error) {
    console.error('Meta Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/integrations?error=server_error', request.url));
  }
};
