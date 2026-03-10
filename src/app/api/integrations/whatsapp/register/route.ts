import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { exchangeCodeForToken, fetchWabaDetails, getLongLivedToken } from '@/libs/Meta';
import { integrationSchema } from '@/models/Schema';

export const POST = async (request: Request) => {
  const { orgId, userId } = await auth();

  if (!orgId || !userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // 1. Exchange code for token (using empty redirect_uri for JS SDK)
    const tokenResponse = await exchangeCodeForToken(code, '');
    if (tokenResponse.error) {
      console.error('Meta Token Error:', tokenResponse.error);
      return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
    }

    // 2. Upgrade to long-lived token
    const longLived = await getLongLivedToken(tokenResponse.access_token);
    const accessToken = longLived.access_token || tokenResponse.access_token;

    // 3. Fetch WABA and Phone details
    const wabaDetails = await fetchWabaDetails(accessToken);

    // 4. Save Integration in DB
    const existing = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, 'whatsapp'),
      ),
    });

    const data = {
      organizationId: orgId,
      type: 'whatsapp' as const,
      providerId: wabaDetails.wabaId, // The WABA ID
      accessToken,
      config: JSON.stringify({
        phoneNumberId: wabaDetails.phoneNumberId,
        displayPhoneNumber: wabaDetails.displayPhoneNumber,
        wabaName: wabaDetails.wabaName,
      }),
      status: 'active',
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(integrationSchema)
        .set(data)
        .where(
          and(
            eq(integrationSchema.organizationId, orgId),
            eq(integrationSchema.type, 'whatsapp'),
          ),
        );
    } else {
      await db.insert(integrationSchema).values(data);
    }

    return NextResponse.json({ success: true, details: wabaDetails });
  } catch (error) {
    console.error('WhatsApp Registration Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
};
