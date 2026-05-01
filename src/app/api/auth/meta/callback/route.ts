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
      const { exchangeInstagramCodeForToken, getInstagramLongLivedToken } = await import('@/libs/Meta');
      const shortTokenRes = await exchangeInstagramCodeForToken(code);
      if (shortTokenRes.access_token) {
        // Exchange for long lived token
        const longTokenRes = await getInstagramLongLivedToken(shortTokenRes.access_token);
        tokenResponse = longTokenRes.access_token ? longTokenRes : shortTokenRes;
        tokenResponse.user_id = shortTokenRes.user_id;
      } else {
        tokenResponse = shortTokenRes;
      }
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
    if (platform === 'messenger' || (platform === 'instagram' && mode !== 'instagram_direct')) {
      return NextResponse.redirect(new URL(`/${lang}/dashboard/integrations/meta-select?platform=${platform}`, request.url));
    } else if (platform === 'instagram' && mode === 'instagram_direct') {
      try {
        let igAccountId = tokenResponse.user_id?.toString();
        let igUsername = '';
        let igProfilePic = '';

        const igMeRes = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username,name,profile_picture_url&access_token=${accessToken}`);
        if (igMeRes.ok) {
          const igMeData = await igMeRes.json();
          if (igMeData.id) {
            igAccountId = igMeData.id;
          }
          igUsername = igMeData.username || '';
          igProfilePic = igMeData.profile_picture_url || '';
        }

        if (igAccountId) {
          const existingIg = await db.query.integrationSchema.findFirst({
            where: and(
              eq(integrationSchema.organizationId, orgId),
              eq(integrationSchema.type, 'instagram'),
            ),
          });

          const integrationData = {
            accessToken,
            providerId: igAccountId,
            config: JSON.stringify({ igAccountId, method: 'instagram_direct', username: igUsername, profilePic: igProfilePic }),
            status: 'active' as const,
            updatedAt: new Date(),
          };

          if (existingIg) {
            await db.update(integrationSchema)
              .set(integrationData)
              .where(eq(integrationSchema.id, existingIg.id));
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
        logger.error(e, 'Connect Instagram Direct Error');
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
