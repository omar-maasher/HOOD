import BookingsClient from './BookingsClient';
import { getBookings } from './actions';
import { getProducts } from '../products/actions';

export async function generateMetadata() {
  return {
    title: `المواعيد والحجوزات | Hoodtrading`,
  };
}

export default async function BookingsPage() {
  let bookings: any[] = [];
  let products: any[] = [];
  try {
    [bookings, products] = await Promise.all([
      getBookings(),
      getProducts()
    ]);
  } catch (error) {
    console.error('Bookings page error:', error);
  }
  
  return <BookingsClient initialBookings={bookings} products={products} />;
}
