import { and, eq, ilike, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { aiSettingsSchema, bookingSchema, businessProfileSchema, productSchema } from '@/models/Schema';

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
        const { customerName, contactInfo, serviceDetails, bookingDate, source, socialUsername, notes } = params;

        const [newBooking] = await db.insert(bookingSchema).values({
          organizationId,
          customerName,
          contactInfo,
          serviceDetails,
          bookingDate: new Date(bookingDate || Date.now()),
          source: source || 'ai_bot',
          socialUsername,
          notes,
          status: 'upcoming',
        }).returning();

        return NextResponse.json({ success: true, bookingId: newBooking?.id });
      }

      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[AI_TOOLS_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
