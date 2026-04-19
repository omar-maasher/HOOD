import { and, eq, ilike, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { aiSettingsSchema, bookingSchema, businessProfileSchema, organizationSchema, productSchema } from '@/models/Schema';

/**
 * AI Tools API - The bridge between n8n and the platform data.
 * Secured via a SHARED_SECRET or organization context.
 */
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
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
      case 'create_booking': {
        const { customerName, contactInfo, bookingDate, source, socialUsername, notes, doctorName, serviceType } = params;
        const serviceDetails = params.serviceDetails || params.details || '';

        if (!customerName) {
          return NextResponse.json({ error: 'Missing customerName' }, { status: 400 });
        }

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
          contactInfo,
          serviceDetails,
          doctorName,
          serviceType,
          bookingDate: validBookingDate,
          source: source || 'ai_bot',
          socialUsername,
          notes,
          status: 'upcoming',
        }).returning();

        return NextResponse.json({
          success: true,
          bookingId: newBooking?.id,
          message: 'تم الحجز بنجاح',
        });
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

      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[AI_TOOLS_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
