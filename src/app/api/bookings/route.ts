import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { bookingSchema } from '@/models/Schema';

/**
 * Handle creation and listing of bookings from n8n or internal dashboard.
 */
export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const secretToken = process.env.INTERNAL_API_SECRET;

    if (!secretToken || authHeader !== `Bearer ${secretToken}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { 
      organizationId, 
      customerName, 
      contactInfo, 
      serviceDetails, 
      bookingDate, 
      source, 
      socialUsername,
      notes 
    } = body;

    if (!organizationId || !customerName || !bookingDate) {
      return NextResponse.json({ error: 'Missing required fields: organizationId, customerName, bookingDate' }, { status: 400 });
    }

    const newBooking = await db.insert(bookingSchema).values({
      organizationId,
      customerName,
      contactInfo,
      serviceDetails,
      bookingDate: new Date(bookingDate),
      source: source || 'unknown',
      socialUsername,
      notes,
      status: 'upcoming'
    }).returning();

    return NextResponse.json({ success: true, booking: newBooking[0] });
  } catch (error: any) {
    console.error('Booking Creation Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('orgId');

  if (!organizationId) {
    return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
  }

  const bookings = await db.select()
    .from(bookingSchema)
    .where(eq(bookingSchema.organizationId, organizationId))
    .orderBy(bookingSchema.bookingDate);

  return NextResponse.json(bookings);
};
