import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { replyToInstagramComment, sendInstagramMessage, sendMessengerMessage, sendWhatsAppMessage } from '@/libs/Meta';
import { conversationSchema, integrationSchema, messageSchema, organizationSchema } from '@/models/Schema';
import { PLAN_ID } from '@/utils/AppConfig';

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
    const { platform, orgId, recipientId, message, commentId } = body;

    // recipientId is optional if commentId is provided for Instagram
    if (!platform || !orgId || (!recipientId && !commentId) || !message) {
      return NextResponse.json({ error: 'Missing required fields: platform, orgId, message and (recipientId or commentId)' }, { status: 400 });
    }

    // 1.5 Check for branding requirements based on plan
    let finalMessage = message;
    try {
      const org = await db.query.organizationSchema.findFirst({
        where: eq(organizationSchema.id, orgId),
      });

      if (!org?.planId || org.planId === PLAN_ID.FREE) {
        // Use italics and special formatting to make it look like a "small gray" footer
        const isArabic = /[\u0600-\u06FF]/.test(message);
        const footer = isArabic
          ? '_— مدعوم بواسطة HoodTrading_'
          : '_— ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴏᴏᴅᴛʀᴀᴅɪɴɢ_';
        finalMessage = `${message}\n\n${footer}`;
      }
    } catch (e) {
      console.error('Failed to check org plan for branding', e);
    }

    // 2. Fetch the specific integration (Page Token) - Order by updatedAt DESC to get the latest one
    const platformIntegration = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.organizationId, orgId),
        eq(integrationSchema.type, platform),
      ),
      orderBy: (integration, { desc }) => [desc(integration.updatedAt)],
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
      let isDirectLogin = false;
      if (platformIntegration.config) {
        try {
          const configObj = JSON.parse(platformIntegration.config);
          if (configObj.pageId) {
            pageIdForSending = configObj.pageId;
          }
          if (configObj.method === 'instagram_direct') {
            isDirectLogin = true;
          }
        } catch (e) {
          console.error('Failed to parse Instagram integration config', e);
        }
      }

      if (!token || !pageIdForSending) {
        return NextResponse.json({ error: 'Instagram integration is missing token or account ID.' }, { status: 400 });
      }

      logger.info({
        platform,
        orgId,
        providerId: platformIntegration.providerId,
        pageIdForSending,
        isDirectLogin,
        tokenPrefix: `${token.substring(0, 10)}...`,
      }, '[SEND DEBUG] Attempting to send Instagram message');

      if (commentId) {
        // If commentId is provided, we reply to a comment instead of sending a DM
        responseData = await replyToInstagramComment(commentId, finalMessage, token, isDirectLogin);
      } else if (recipientId) {
        responseData = await sendInstagramMessage(pageIdForSending, recipientId, finalMessage, token, isDirectLogin);
      }
    } else if (platform === 'messenger') {
      if (!platformIntegration) {
        return NextResponse.json({ error: 'No Messenger integration found for this organization.' }, { status: 404 });
      }

      const token = platformIntegration.accessToken;
      const pageId = platformIntegration.providerId;

      if (!token || !pageId) {
        return NextResponse.json({ error: 'Messenger integration is missing token or ID.' }, { status: 400 });
      }

      responseData = await sendMessengerMessage(pageId, recipientId, finalMessage, token);
    } else if (platform === 'whatsapp') {
      if (!platformIntegration) {
        return NextResponse.json({ error: 'No WhatsApp integration found for this organization.' }, { status: 404 });
      }

      const token = platformIntegration.accessToken;

      let phoneNumberId = platformIntegration.providerId; // fallback
      if (platformIntegration.config) {
        try {
          const configObj = JSON.parse(platformIntegration.config);
          if (configObj.phoneNumberId) {
            phoneNumberId = configObj.phoneNumberId;
          }
        } catch (e) {
          console.error('Failed to parse WhatsApp integration config', e);
        }
      }

      if (!token || !phoneNumberId) {
        return NextResponse.json({ error: 'WhatsApp integration is missing token or Phone Number ID.' }, { status: 400 });
      }

      responseData = await sendWhatsAppMessage(phoneNumberId, recipientId, finalMessage, token);

      // --- Sync WhatsApp bot replies to Inbox DB ---
      // Since WhatsApp does not send echo webhooks containing text, we must manually save it here.
      if (recipientId) {
        const conv = await db.query.conversationSchema.findFirst({
          where: and(
            eq(conversationSchema.organizationId, orgId),
            eq(conversationSchema.platform, 'whatsapp'),
            eq(conversationSchema.externalId, recipientId),
          ),
        });

        if (conv) {
          await db.insert(messageSchema).values({
            organizationId: orgId,
            conversationId: conv.id,
            direction: 'outgoing',
            text: finalMessage,
            type: 'text',
            metadata: JSON.stringify(responseData),
          });

          await db.update(conversationSchema)
            .set({
              lastMessage: finalMessage,
              lastMessageAt: new Date(),
              isUnread: 'false',
            })
            .where(eq(conversationSchema.id, conv.id));
        }
      }
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
