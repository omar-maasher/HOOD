import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getAdminStats, getAllOrganizations } from './actions';
import { AdminClient } from './AdminClient';

export default async function AdminPage() {
  const user = await currentUser();
  const emails = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];

  if (!user || !user.emailAddresses.some(e => emails.includes(e.emailAddress))) {
    redirect('/dashboard');
  }

  const [stats, organizations] = await Promise.all([
    getAdminStats(),
    getAllOrganizations(),
  ]);

  return (
    <AdminClient stats={stats} organizations={organizations} />
  );
}
