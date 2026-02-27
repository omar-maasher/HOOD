import { NextResponse } from 'next/server';
import { sendInstagramMessage } from '@/libs/Meta';
import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';
import { eq, and } from 'drizzle-orm';

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

    // 2. Fetch the specific integration (Page Token) for Instagram
    const instagramIntegration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, 'instagram')
      ),
    });

    let responseData;

    // 3. Send message using the appropriate platform method
    if (platform === 'instagram') {
      if (!instagramIntegration) {
        return NextResponse.json({ error: 'No Instagram integration found for this organization.' }, { status: 404 });
      }

      const token = instagramIntegration.accessToken;
      const accountIdFromDB = instagramIntegration.providerId; // Instagram Business Account ID
      
      if (!token || !accountIdFromDB) {
        return NextResponse.json({ error: 'Instagram integration is missing token or account ID.' }, { status: 400 });
      }

      responseData = await sendInstagramMessage(accountIdFromDB, recipientId, message, token);
    } 
    /* 
    else if (platform === 'whatsapp') {
      // Future implementation for WhatsApp
    } 
    */
    else {
      return NextResponse.json({ error: 'Unsupported platform specified.' }, { status: 400 });
    }

    // 4. Return success to n8n
    return NextResponse.json({ success: true, data: responseData });

  } catch (error: any) {
    console.error('API Send Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
};
