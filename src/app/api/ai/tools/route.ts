import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { syncBookingToGoogleSheet } from '@/libs/GoogleSheets';
import { sendWhatsAppButtonsMessage, sendWhatsAppListMessage } from '@/libs/Meta';
import { notifyOrg } from '@/libs/Notifications';
import { aiSettingsSchema, bookingSchema, businessProfileSchema, conversationSchema, integrationSchema, organizationSchema, productSchema } from '@/models/Schema';

/**
 * AI Tools API - The bridge between n8n and the platform data.
 * Secured via a SHARED_SECRET or organization context.
 */
export const POST = async (request: Request) => {
  try {
    let body: any;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      // Support Form Data for n8n compatibility
      const formData = await request.formData();
      body = {};
      formData.forEach((value, key) => {
        if (key === 'params' && typeof value === 'string') {
          try {
            body[key] = JSON.parse(value);
          } catch {
            body[key] = value;
          }
        } else {
          body[key] = value;
        }
      });

      // If params is still just a string (n8n might send flat fields)
      if (typeof body.params !== 'object' || body.params === null) {
        body.params = {
          customerName: formData.get('customerName'),
          reason: formData.get('reason'),
          platform: formData.get('platform'),
          senderId: formData.get('senderId'),
        };
      }
    }

    const { action, organizationId, params, secret } = body;

    // 1. Security Check
    // In a real production, you'd compare 'secret' with a stored DB secret or Env
    const platformSecret = process.env.AI_TOOLS_SECRET || 'hood_secret_123';
    if (secret !== platformSecret) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    if (!organizationId) {
      return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
    }

    // 2. Route Actions
    switch (action) {
      // --- PRODUCT TOOLS ---
      case 'search_products': {
        const query = params?.query || '';
        const results = await db.select()
          .from(productSchema)
          .where(
            and(
              eq(productSchema.organizationId, organizationId),
              eq(productSchema.status, 'active'),
              or(
                ilike(productSchema.name, `%${query}%`),
                ilike(productSchema.category || '', `%${query}%`),
              ),
            ),
          )
          .limit(10);
        return NextResponse.json({ products: results });
      }

      // --- BUSINESS INFO TOOLS ---
      case 'get_business_info': {
        const profile = await db.query.businessProfileSchema.findFirst({
          where: eq(businessProfileSchema.organizationId, organizationId),
        });
        const aiSettings = await db.query.aiSettingsSchema.findFirst({
          where: eq(aiSettingsSchema.organizationId, organizationId),
        });

        return NextResponse.json({
          profile: profile || {},
          faqs: aiSettings?.faqs || [],
          policies: profile?.policies || '',
          workingHours: profile?.workingHours || '',
        });
      }

      // --- BOOKING TOOLS ---
      case 'list_bookings': {
        const date = params?.date; // Optional: filter by date
        const results = await db.query.bookingSchema.findMany({
          where: and(
            eq(bookingSchema.organizationId, organizationId),
            date ? sql`DATE(${bookingSchema.bookingDate}) = DATE(${date})` : sql`${bookingSchema.bookingDate} >= NOW()`,
          ),
          orderBy: (bookings, { asc }) => [asc(bookings.bookingDate)],
          limit: 20,
        });
        return NextResponse.json({ bookings: results });
      }

      case 'create_booking': {
        if (!params) {
          return NextResponse.json({ error: 'Missing params object' }, { status: 400 });
        }

        const { customerName, contactInfo, bookingDate, source, socialUsername, notes, doctorName, serviceType } = params;
        const serviceDetails = params.serviceDetails || params.details || '';

        // eslint-disable-next-line no-console
        console.log('[AI_TOOLS] Attempting to create booking:', { organizationId, customerName, bookingDate });

        if (!customerName) {
          return NextResponse.json({ error: 'Missing customerName in params' }, { status: 400 });
        }

        try {
          // Ensure organization exists to avoid foreign key violation
          await db.insert(organizationSchema)
            .values({ id: organizationId })
            .onConflictDoNothing();

          let validBookingDate = new Date();
          if (bookingDate) {
            const parsedDate = new Date(bookingDate);
            if (!Number.isNaN(parsedDate.getTime())) {
              validBookingDate = parsedDate;
            }
          }

          const [newBooking] = await db.insert(bookingSchema).values({
            organizationId,
            customerName,
            contactInfo: contactInfo || '',
            serviceDetails: serviceDetails || '',
            doctorName: doctorName || '',
            serviceType: serviceType || '',
            bookingDate: validBookingDate,
            source: source || 'ai_bot',
            socialUsername: socialUsername || '',
            notes: notes || '',
            status: 'upcoming',
          }).returning();

          // eslint-disable-next-line no-console
          console.log('[AI_TOOLS] Booking created successfully:', newBooking?.id);

          // --- PUSH NOTIFICATION ---
          await notifyOrg(organizationId, 'حجز جديد تلقائي 🤖', `العميل: ${customerName} | تم الحجز عبر الذكاء الاصطناعي.`, {
            bookingId: newBooking?.id,
            customerName,
          });

          // --- SYNC TO GOOGLE SHEETS ---
          if (newBooking) {
            await syncBookingToGoogleSheet(organizationId, newBooking);
          }

          return NextResponse.json({
            success: true,
            bookingId: newBooking?.id,
            message: 'تم الحجز بنجاح',
          });
        } catch (dbError: any) {
          console.error('[AI_TOOLS_DB_ERROR]', dbError);
          return NextResponse.json({ error: `Database Error: ${dbError.message}` }, { status: 500 });
        }
      }

      // --- TRACKING TOOLS ---
      case 'get_booking_status': {
        const bookingId = Number(params?.bookingId);
        if (!bookingId) {
          return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
        }

        const booking = await db.query.bookingSchema.findFirst({
          where: and(
            eq(bookingSchema.id, bookingId),
            eq(bookingSchema.organizationId, organizationId),
          ),
        });

        if (!booking) {
          return NextResponse.json({ message: 'حجز غير موجود، يرجى التأكد من الرقم.' });
        }

        return NextResponse.json({
          status: booking.status,
          customerName: booking.customerName,
          bookingDate: booking.bookingDate,
          notes: booking.notes,
        });
      }

      case 'request_human': {
        const { customerName: aiCustomerName, reason, platform, senderId } = params || {};

        // eslint-disable-next-line no-console
        console.log('Request Human Tool called with:', { aiCustomerName, senderId, platform, organizationId });

        let conversationLink = '/ar/dashboard/inbox';
        let finalCustomerName = aiCustomerName;

        // Try to find the conversation to get the real name and link
        if (senderId || (aiCustomerName && aiCustomerName !== '{name}')) {
          const conv = await db.query.conversationSchema.findFirst({
            where: and(
              eq(conversationSchema.organizationId, organizationId),
              senderId
                ? eq(conversationSchema.externalId, String(senderId))
                : eq(conversationSchema.customerName, String(aiCustomerName)),
            ),
          });

          if (conv) {
            conversationLink = `/ar/dashboard/inbox?id=${conv.id}`;
            // Always prefer DB name over placeholder or "Unknown"
            if (!finalCustomerName || finalCustomerName === '{name}' || finalCustomerName === 'غير معروف') {
              finalCustomerName = conv.customerName || conv.externalId;
            }
          }
        }

        await notifyOrg(
          organizationId,
          'طلب تدخل بشري 🙋‍♂️',
          `العميل: ${finalCustomerName || 'غير معروف'} يطلب التحدث مع موظف. ${reason && reason !== '{reason}' ? `السبب: ${reason}` : ''}`,
          {
            type: 'human_request',
            platform: platform || 'Unknown',
            customerName: finalCustomerName,
            link: conversationLink,
          },
          'warning',
        );

        return NextResponse.json({ success: true, message: 'تم إخطار الموظفين بطلبك.' });
      }

      // --- WHATSAPP INTERACTIVE TOOLS ---
      case 'send_whatsapp_list': {
        const { recipientId, header, body, footer, buttonText, sections } = params || {};
        if (!recipientId || !body || !buttonText || !sections) {
          return NextResponse.json({ error: 'Missing required params (recipientId, body, buttonText, sections)' }, { status: 400 });
        }

        const integration = await db.query.integrationSchema.findFirst({
          where: and(eq(integrationSchema.organizationId, organizationId), eq(integrationSchema.type, 'whatsapp'), eq(integrationSchema.status, 'active')),
        });

        if (!integration || !integration.providerId || !integration.accessToken) {
          return NextResponse.json({ error: 'Active WhatsApp integration not found for this organization.' }, { status: 404 });
        }

        try {
          await sendWhatsAppListMessage(integration.providerId, recipientId, integration.accessToken, {
            header,
            body,
            footer,
            buttonText,
            sections,
          });
          return NextResponse.json({ success: true, message: 'List message sent successfully' });
        } catch (e: any) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
      }

      case 'send_whatsapp_buttons': {
        const { recipientId, body, footer, buttons } = params || {};
        if (!recipientId || !body || !buttons) {
          return NextResponse.json({ error: 'Missing required params (recipientId, body, buttons)' }, { status: 400 });
        }

        const integration = await db.query.integrationSchema.findFirst({
          where: and(eq(integrationSchema.organizationId, organizationId), eq(integrationSchema.type, 'whatsapp'), eq(integrationSchema.status, 'active')),
        });

        if (!integration || !integration.providerId || !integration.accessToken) {
          return NextResponse.json({ error: 'Active WhatsApp integration not found for this organization.' }, { status: 404 });
        }

        try {
          await sendWhatsAppButtonsMessage(integration.providerId, recipientId, integration.accessToken, {
            body,
            footer,
            buttons,
          });
          return NextResponse.json({ success: true, message: 'Buttons message sent successfully' });
        } catch (e: any) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
      }

      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[AI_TOOLS_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
