import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { notifyOrg } from '@/libs/Notifications';
import { aiSettingsSchema, bookingSchema, businessProfileSchema, conversationSchema, organizationSchema, productSchema } from '@/models/Schema';

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
      if (typeof body.params !== 'object') {
        body.params = {
          customerName: formData.get('customerName'),
          reason: formData.get('reason'),
          platform: formData.get('platform'),
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
        const { customerName, reason, platform, senderId } = params || {};
        let conversationLink = '/dashboard/inbox';

        // Try to find the conversation ID to make the link direct
        if (senderId) {
          const conv = await db.query.conversationSchema.findFirst({
            where: and(
              eq(conversationSchema.organizationId, organizationId),
              eq(conversationSchema.externalId, String(senderId)),
            ),
          });
          if (conv) {
            conversationLink = `/dashboard/inbox/${conv.id}`;
          }
        }

        await notifyOrg(
          organizationId,
          'طلب تدخل بشري 🙋‍♂️',
          `العميل: ${customerName || 'غير معروف'} يطلب التحدث مع موظف. ${reason ? `السبب: ${reason}` : ''}`,
          {
            type: 'human_request',
            platform: platform || 'Unknown',
            customerName,
            link: conversationLink,
          },
          'warning',
        );

        return NextResponse.json({ success: true, message: 'تم إخطار الموظفين بطلبك.' });
      }

      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[AI_TOOLS_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
