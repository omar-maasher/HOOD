import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { bookingSchema, organizationSchema } from '@/models/Schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      contactInfo,
      socialUsername,
      bookingDate,
      serviceDetails,
      notes,
      doctorName,
      serviceType,
      source,
      organizationId, // Optional: n8n might provide this if it knows the target org
    } = body;

    // Authentication Strategy:
    // 1. If it's a request from the frontend (logged in user)
    // 2. If it's a request from n8n (X-API-KEY)

    const apiKey = req.headers.get('x-api-key');
    let targetOrgId = organizationId;

    if (apiKey) {
      // Find organization by API Key OR match by Organization ID directly (as requested for simplicity)
      const org = await db.query.organizationSchema.findFirst({
        where: apiKey.startsWith('org_')
          ? eq(organizationSchema.id, apiKey) // Directly use Org ID as Key
          : eq(organizationSchema.apiKey, apiKey),
      });

      if (!org) {
        return NextResponse.json({ error: 'Invalid API Key or Organization ID' }, { status: 401 });
      }
      targetOrgId = org.id;
    } else {
      // Fallback to clerk user for manual tests
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // You might want to find the user's org here
    }

    if (!targetOrgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    if (!customerName || !bookingDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = await db.insert(bookingSchema).values({
      customerName,
      contactInfo,
      socialUsername,
      bookingDate: new Date(bookingDate),
      serviceDetails,
      notes,
      doctorName,
      serviceType,
      source: source || 'Bot',
      status: 'upcoming',
      organizationId: targetOrgId,
      updatedAt: new Date(),
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking[0],
    });
  } catch (error: any) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
