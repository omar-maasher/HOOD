import { Buffer } from 'node:buffer';

import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { exchangeCodeForToken, getLongLivedToken } from '@/libs/Meta';
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
    const { orgId, platform, locale, mode } = state;
    lang = locale || 'ar';

    // ─── TOKEN EXCHANGE ──────────────────────────────────────────────
    let tokenResponse: any;
    if (mode === 'instagram_direct') {
      const { exchangeInstagramCodeForToken } = await import('@/libs/Meta');
      tokenResponse = await exchangeInstagramCodeForToken(code);
    } else {
      tokenResponse = await exchangeCodeForToken(code);
    }

    if (tokenResponse.error || !tokenResponse.access_token) {
      console.error('Meta Token Exchange Error:', tokenResponse.error || 'No access token');
      return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=token_exchange_failed`, request.url));
    }

    // Get long-lived token (60 days) - Only for Facebook-based tokens
    let accessToken = tokenResponse.access_token;

    if (mode !== 'instagram_direct') {
      const longLivedResponse = await getLongLivedToken(tokenResponse.access_token);
      accessToken = longLivedResponse.access_token || tokenResponse.access_token;

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
    }

    // CREATE DISPLAY RECORD BASED ON PLATFORM CLICKED
    if (platform === 'messenger') {
      try {
        const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
        if (!pagesRes.ok) {
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=pages_fetch_failed`, request.url));
        }

        const pagesData = await pagesRes.json();
        if (pagesData.data && pagesData.data.length > 0) {
          const page = pagesData.data[0];
          const pageToken = page.access_token;
          const pageId = page.id;

          // --- WEBHOOK SUBSCRIPTION ---
          try {
            await fetch(`https://graph.facebook.com/v21.0/${pageId}/subscribed_apps?access_token=${pageToken}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscribed_fields: ['messages', 'messaging_postbacks'] }),
            });
            logger.info({ pageId }, '[WEBHOOK] Successfully subscribed Messenger Page to notifications');
          } catch (e) {
            logger.error(e, '[WEBHOOK] Failed to subscribe Messenger Page');
          }

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
        } else {
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_facebook_pages`, request.url));
        }
      } catch (e) {
        logger.error(e, 'Auto-connect Messenger Error');
        return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=messenger_connect_failed`, request.url));
      }
    } else if (platform === 'instagram') {
      try {
        let igAccountId = '';
        let igPageToken = accessToken;
        let igPageId = ''; // For direct IG, we might not have a FB Page ID immediately
        let method = 'facebook_login';

        if (mode === 'instagram_direct') {
          method = 'instagram_direct';
          igAccountId = tokenResponse.user_id?.toString();

          // If user_id is missing, try fetching it
          if (!igAccountId) {
            const igMeRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
            if (igMeRes.ok) {
              const igMeData = await igMeRes.json();
              igAccountId = igMeData.id;
            }
          }
        } else {
          // Instagram via Facebook Login (through Facebook Pages)
          const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
          if (!pagesRes.ok) {
            return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=pages_fetch_failed`, request.url));
          }

          const pagesData = await pagesRes.json();
          if (!pagesData.data || pagesData.data.length === 0) {
            return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_facebook_pages`, request.url));
          }

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
        }

        if (igAccountId) {
          // --- WEBHOOK SUBSCRIPTION ---
          if (igPageId && igPageToken) {
            try {
              await fetch(`https://graph.facebook.com/v21.0/${igPageId}/subscribed_apps?access_token=${igPageToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscribed_fields: ['messages', 'messaging_postbacks', 'comments', 'mentions'] }),
              });
              logger.info({ igPageId }, '[WEBHOOK] Successfully subscribed Instagram Page to notifications');
            } catch (e) {
              logger.error(e, '[WEBHOOK] Failed to subscribe Instagram Page');
            }
          }

          const existingIg = await db.query.integrationSchema.findFirst({
            where: and(
              eq(integrationSchema.organizationId, orgId),
              eq(integrationSchema.type, 'instagram'),
            ),
          });

          const integrationData = {
            accessToken: igPageToken,
            providerId: igPageId || igAccountId, // fallback to igAccountId if no FB Page
            config: JSON.stringify({ igAccountId, method }),
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
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_instagram_account`, request.url));
        }
      } catch (e) {
        logger.error(e, 'Connect Instagram Error');
        return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=instagram_connect_failed`, request.url));
      }
    } else if (platform === 'whatsapp') {
      try {
        const wabaRes = await fetch(`https://graph.facebook.com/v21.0/me/whatsapp_business_accounts?access_token=${accessToken}`);
        if (!wabaRes.ok) {
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=waba_fetch_failed`, request.url));
        }

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
            } else {
              return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_whatsapp_phone`, request.url));
            }
          } else {
            return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=waba_phone_fetch_failed`, request.url));
          }
        } else {
          return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=no_waba_account`, request.url));
        }
      } catch (e) {
        console.error('Auto-connect WhatsApp Error:', e);
        return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=whatsapp_connect_failed`, request.url));
      }
    }

    return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?success=connected`, request.url));
  } catch (error) {
    console.error('Meta Callback Error:', error);
    return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations?error=server_error`, request.url));
  }
};
