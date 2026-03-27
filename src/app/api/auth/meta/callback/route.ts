import { Buffer } from 'node:buffer';

import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { exchangeCodeForToken, exchangeInstagramCodeForToken, getInstagramLongLivedToken, getLongLivedToken } from '@/libs/Meta';
import { integrationSchema } from '@/models/Schema';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateBase64 = searchParams.get('state');

  if (!code || !stateBase64) {
    return NextResponse.redirect(new URL('/ar/dashboard/integrations?error=missing_params', request.url));
  }

  let lang = 'ar';

  try {
    const state = JSON.parse(Buffer.from(stateBase64, 'base64').toString());
    const { orgId, platform, locale } = state;
    lang = locale || 'ar';

    // ─── INSTAGRAM (New Direct Instagram OAuth Flow) ───────────────────
    if (platform === 'instagram') {
      try {
        // 1. Exchange code for short-lived token via Instagram API
        const tokenResponse = await exchangeInstagramCodeForToken(code);
        logger.info({ tokenResponse }, 'Instagram Token Response');

        if (tokenResponse.error_type || tokenResponse.error_message) {
          logger.error({ tokenResponse }, 'Instagram Token Exchange Error');
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=token_exchange_failed`, request.url));
        }

        const shortLivedToken = tokenResponse.access_token;
        const igUserId = tokenResponse.user_id; // Instagram User ID

        if (!shortLivedToken) {
          logger.error({ tokenResponse }, 'No access token in Instagram response');
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_access_token`, request.url));
        }

        // 2. Exchange for long-lived token (60 days)
        const longLivedResponse = await getInstagramLongLivedToken(shortLivedToken);
        const accessToken = longLivedResponse.access_token || shortLivedToken;

        logger.info({ igUserId }, 'Instagram Long-lived token obtained');

        // 3. Fetch the user's Instagram profile to get username
        let igUsername = '';
        try {
          const profileRes = await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,username&access_token=${accessToken}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            igUsername = profileData.username || '';
            logger.info({ profileData }, 'Instagram profile fetched');
          }
        } catch (e) {
          logger.error(e, 'Failed to fetch IG profile');
        }

        // 4. Save integration to database
        const existingIg = await db.query.integrationSchema.findFirst({
          where: and(
            eq(integrationSchema.organizationId, orgId),
            eq(integrationSchema.type, 'instagram'),
          ),
        });

        const integrationData = {
          accessToken,
          providerId: String(igUserId), // Instagram User ID
          config: JSON.stringify({ igUserId, igUsername }),
          status: 'active' as const,
          updatedAt: new Date(),
        };

        if (existingIg) {
          await db.update(integrationSchema)
            .set(integrationData)
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
            ...integrationData,
          });
        }

        return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?success=connected`, request.url));
      } catch (e) {
        console.error('Instagram OAuth Error:', e);
        return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=instagram_oauth_failed`, request.url));
      }
    }

    // ─── FACEBOOK-BASED PLATFORMS (Messenger, WhatsApp) ────────────────
    // Exchange short-lived code for token
    const tokenResponse = await exchangeCodeForToken(code);

    if (tokenResponse.error) {
      console.error('Meta Token Exchange Error:', tokenResponse.error);
      return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=token_exchange_failed`, request.url));
    }

    // Get long-lived token (60 days)
    const longLivedResponse = await getLongLivedToken(tokenResponse.access_token);
    const accessToken = longLivedResponse.access_token || tokenResponse.access_token;

    // Save root Facebook token
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
          if (pagesData.data && pagesData.data.length > 0) {
            const page = pagesData.data[0];
            const pageToken = page.access_token;
            const pageId = page.id;

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
        logger.error(e, 'Auto-connect Messenger Error');
      }
    } else if (platform === 'instagram_fb') {
      // OLD FLOW: Instagram via Facebook Login (through Facebook Pages)
      try {
        const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          if (pagesData.data && pagesData.data.length > 0) {
            // Find a page linked to an Instagram account
            let igAccountId = '';
            let igPageToken = '';
            let igPageId = '';

            for (const page of pagesData.data) {
              const igRes = await fetch(`https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`);
              if (igRes.ok) {
                const igData = await igRes.json();
                if (igData.instagram_business_account) {
                  igAccountId = igData.instagram_business_account.id;
                  igPageToken = page.access_token;
                  igPageId = page.id;
                  break;
                }
              }
            }

            if (igAccountId) {
              const existingIg = await db.query.integrationSchema.findFirst({
                where: and(
                  eq(integrationSchema.organizationId, orgId),
                  eq(integrationSchema.type, 'instagram'),
                ),
              });

              const integrationData = {
                accessToken: igPageToken,
                providerId: igPageId, // Facebook Page ID for webhook matching
                config: JSON.stringify({ igAccountId, method: 'facebook_login' }),
                status: 'active' as const,
                updatedAt: new Date(),
              };

              if (existingIg) {
                await db.update(integrationSchema)
                  .set(integrationData)
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
                  ...integrationData,
                });
              }
            } else {
              return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_instagram_account&pages_found=${pagesData.data.length}`, request.url));
            }
          }
        }
      } catch (e) {
        logger.error(e, 'Auto-connect Instagram (FB flow) Error');
      }
    } else if (platform === 'whatsapp') {
      try {
        const wabaRes = await fetch(`https://graph.facebook.com/v21.0/me/whatsapp_business_accounts?access_token=${accessToken}`);
        if (wabaRes.ok) {
          const wabaData = await wabaRes.json();
          if (wabaData.data && wabaData.data.length > 0) {
            const wabaId = wabaData.data[0].id;

            const phoneRes = await fetch(`https://graph.facebook.com/v21.0/${wabaId}/phone_numbers?access_token=${accessToken}`);
            if (phoneRes.ok) {
              const phoneData = await phoneRes.json();
              if (phoneData.data && phoneData.data.length > 0) {
                const phoneNumberId = phoneData.data[0].id;

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
                      config: JSON.stringify({ phoneNumberId }),
                      updatedAt: new Date(),
                    })
                    .where(
                      and(
                        eq(integrationSchema.organizationId, orgId),
                        eq(integrationSchema.type, 'whatsapp'),
                      ),
                    );
                } else {
                  await db.insert(integrationSchema).values({
                    organizationId: orgId,
                    type: 'whatsapp',
                    providerId: wabaId,
                    accessToken,
                    config: JSON.stringify({ phoneNumberId }),
                    status: 'active',
                  });
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Auto-connect WhatsApp Error:', e);
      }
    }

    return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?success=connected`, request.url));
  } catch (error) {
    console.error('Meta Callback Error:', error);
    return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=server_error`, request.url));
  }
};
