import { getProducts } from '../products/actions';
import { getBookings } from './actions';
import BookingsClient from './BookingsClient';

export async function generateMetadata(props: { params: { locale: string } }) {
  return {
    title: props.params.locale === 'ar' ? 'المواعيد والحجوزات | Hoodtrading' : 'Bookings & Appointments | Hoodtrading',
  };
}

export default async function BookingsPage() {
  let bookings: any[] = [];
  let products: any[] = [];
  try {
    [bookings, products] = await Promise.all([
      getBookings(),
      getProducts(),
    ]);
  } catch (error) {
    console.error('Bookings page error:', error);
  }

  return <BookingsClient initialBookings={bookings} products={products} />;
}
