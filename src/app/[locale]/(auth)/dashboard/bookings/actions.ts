'use server';

import { auth } from '@clerk/nextjs/server';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { bookingSchema, organizationSchema } from '@/models/Schema';

export async function getBookings() {
  const { orgId } = await auth();
  if (!orgId) return [];

  const bookings = await db
    .select()
    .from(bookingSchema)
    .where(eq(bookingSchema.organizationId, orgId))
    .orderBy(desc(bookingSchema.bookingDate));

  return bookings.map(b => ({
    ...b,
    cart: b.cart || [],
    bookingDate: b.bookingDate.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));
}

export async function createBooking(data: any) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const [newBooking] = await db.insert(bookingSchema).values({
    organizationId: orgId,
    customerName: data.customerName,
    contactInfo: data.contactInfo,
    cart: data.cart || [],
    bookingDate: new Date(data.bookingDate),
    status: data.status,
    source: data.source,
    socialUsername: data.socialUsername,
    notes: data.notes,
  }).returning();

  return {
    ...newBooking,
    bookingDate: newBooking?.bookingDate.toISOString(),
    createdAt: newBooking?.createdAt.toISOString(),
    updatedAt: newBooking?.updatedAt.toISOString(),
  };
}

export async function updateBooking(id: number, data: any) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  const [updated] = await db.update(bookingSchema)
    .set({
      customerName: data.customerName,
      contactInfo: data.contactInfo,
      cart: data.cart || [],
      bookingDate: new Date(data.bookingDate),
      status: data.status,
      source: data.source,
      socialUsername: data.socialUsername,
      notes: data.notes,
    })
    .where(and(eq(bookingSchema.id, id), eq(bookingSchema.organizationId, orgId)))
    .returning();

  return {
    ...updated,
    bookingDate: updated?.bookingDate.toISOString(),
    createdAt: updated?.createdAt.toISOString(),
    updatedAt: updated?.updatedAt.toISOString(),
  };
}

export async function deleteBooking(id: number) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  await db.delete(bookingSchema)
    .where(and(eq(bookingSchema.id, id), eq(bookingSchema.organizationId, orgId)));
    
  return true;
}

export async function deleteBookings(ids: number[]) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');
  
  if (ids.length === 0) return true;

  await db.delete(bookingSchema)
    .where(and(inArray(bookingSchema.id, ids), eq(bookingSchema.organizationId, orgId)));
    
  return true;
}

export async function updateBookingsStatus(ids: number[], status: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');

  if (ids.length === 0) return true;

  await db.update(bookingSchema)
    .set({ status })
    .where(and(inArray(bookingSchema.id, ids), eq(bookingSchema.organizationId, orgId)));

  return true;
}
