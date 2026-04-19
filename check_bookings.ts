import { eq } from 'drizzle-orm';

import { db } from './src/libs/DB';
import { bookingSchema } from './src/models/Schema';

async function checkBookings() {
  const orgId = 'org_3BrHYLhpXHeiYBq1xabBNb8f3oH';
  const results = await db.select().from(bookingSchema).where(eq(bookingSchema.organizationId, orgId));
  // eslint-disable-next-line no-console
  console.log('Bookings for org:', orgId, JSON.stringify(results, null, 2));
  // eslint-disable-next-line no-console
  console.log('Count:', results.length);
  process.exit(0);
}

checkBookings().catch((err) => {
  console.error(err);
  process.exit(1);
});
