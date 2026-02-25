import BookingsClient from './BookingsClient';
import { getBookings } from './actions';
import { getProducts } from '../products/actions';

export async function generateMetadata() {
  return {
    title: `المواعيد والحجوزات | Hoodtrading`,
  };
}

export default async function BookingsPage() {
  const [bookings, products] = await Promise.all([
    getBookings(),
    getProducts()
  ]);
  
  return <BookingsClient initialBookings={bookings} products={products} />;
}
