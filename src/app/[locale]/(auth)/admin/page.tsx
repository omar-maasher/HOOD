import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getAdminStats, getAllOrganizations } from './actions';
import { AdminClient } from './AdminClient';

export default async function AdminPage() {
  const user = await currentUser();
  const emails = (process.env.SUPER_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

  if (!user || !user.emailAddresses.some(e => emails.includes(e.emailAddress))) {
    redirect('/dashboard');
  }

  try {
    const [stats, organizations] = await Promise.all([
      getAdminStats(),
      getAllOrganizations(),
    ]);

    // Extra safety: Ensure all data is serializable by doing a round-trip
    const serializedOrgs = JSON.parse(JSON.stringify(organizations));
    const serializedStats = JSON.parse(JSON.stringify(stats));

    return (
      <AdminClient stats={serializedStats} organizations={serializedOrgs} />
    );
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-red-600">Platform Error</h1>
        <p className="mb-4 text-muted-foreground">
          Failed to load administrative data. This usually happens if the database connection is unstable or environment variables are missing.
        </p>
        <code className="block rounded bg-muted p-2 text-xs">
          {error instanceof Error ? error.message : 'Unknown database error'}
        </code>
      </div>
    );
  }
}
