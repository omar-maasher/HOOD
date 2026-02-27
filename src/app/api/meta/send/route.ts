import { NextResponse } from 'next/server';
import { sendInstagramMessage } from '@/libs/Meta';
import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';

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
    const { platform, orgId, recipientId, message, accountId } = body;

    if (!platform || !orgId || !recipientId || !message) {
      return NextResponse.json({ error: 'Missing required fields: platform, orgId, recipientId, message' }, { status: 400 });
    }

    // 2. Fetch the Organization to get the Meta Access Tokens
    const orgData = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, orgId),
    });

    if (!orgData) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    let responseData;

    // 3. Send message using the appropriate platform method
    if (platform === 'instagram') {
      const accessToken = orgData.metaAccessToken; // Or whatever column stores the page token
      // Fallback to Env token if not in DB for testing
      const token = accessToken || process.env.META_ACCESS_TOKEN;
      
      if (!token) {
        return NextResponse.json({ error: 'No Meta access token found for this organization.' }, { status: 400 });
      }

      if (!accountId) {
        return NextResponse.json({ error: 'accountId (Instagram Account ID) is required for Instagram messages' }, { status: 400 });
      }

      responseData = await sendInstagramMessage(accountId, recipientId, message, token);
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
