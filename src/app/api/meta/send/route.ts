import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { sendInstagramMessage, sendMessengerMessage } from '@/libs/Meta';
import { integrationSchema } from '@/models/Schema';

export const POST = async (request: Request) => {
  try {
    // 1. Authenticate the request from n8n
    const authHeader = request.headers.get('Authorization');
    const secretToken = process.env.INTERNAL_API_SECRET;

    // Require standard Bearer token or exact match
    if (!secretToken || authHeader !== `Bearer ${secretToken}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { platform, orgId, recipientId, message } = body;

    if (!platform || !orgId || !recipientId || !message) {
      return NextResponse.json({ error: 'Missing required fields: platform, orgId, recipientId, message' }, { status: 400 });
    }

    // 2. Fetch the specific integration (Page Token)
    const platformIntegration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, platform),
      ),
    });

    let responseData;

    // 3. Send message using the appropriate platform method
    if (platform === 'instagram') {
      if (!platformIntegration) {
        return NextResponse.json({ error: 'No Instagram integration found for this organization.' }, { status: 404 });
      }

      const token = platformIntegration.accessToken;

      // We stored the Facebook Page ID inside the 'config' field dynamically
      let pageIdForSending = platformIntegration.providerId; // fallback
      if (platformIntegration.config) {
        try {
          const configObj = JSON.parse(platformIntegration.config);
          if (configObj.pageId) {
            pageIdForSending = configObj.pageId;
          }
        } catch (e) {
          console.error('Failed to parse Instagram integration config', e);
        }
      }

      if (!token || !pageIdForSending) {
        return NextResponse.json({ error: 'Instagram integration is missing token or account ID.' }, { status: 400 });
      }

      responseData = await sendInstagramMessage(pageIdForSending, recipientId, message, token);
    } else if (platform === 'messenger') {
      if (!platformIntegration) {
        return NextResponse.json({ error: 'No Messenger integration found for this organization.' }, { status: 404 });
      }

      const token = platformIntegration.accessToken;
      const pageId = platformIntegration.providerId;

      if (!token || !pageId) {
        return NextResponse.json({ error: 'Messenger integration is missing token or ID.' }, { status: 400 });
      }

      responseData = await sendMessengerMessage(pageId, recipientId, message, token);
    } else {
      return NextResponse.json({ error: 'Unsupported platform specified.' }, { status: 400 });
    }

    // 4. Return success to n8n
    return NextResponse.json({ success: true, data: responseData });
  } catch (error: any) {
    console.error('API Send Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 },
    );
  }
};
