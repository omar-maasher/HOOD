import { getAdminStats, getAllOrganizations, getGlobalSettings } from './actions';
import { AdminClient } from './AdminClient';

export default async function AdminPage() {
  try {
    const [stats, organizations, globalSettings] = await Promise.all([
      getAdminStats(),
      getAllOrganizations(),
      getGlobalSettings(),
    ]);

    // Extra safety: Ensure all data is serializable
    const serializedOrgs = JSON.parse(JSON.stringify(organizations));
    const serializedStats = JSON.parse(JSON.stringify(stats));
    const serializedGlobal = JSON.parse(JSON.stringify(globalSettings));

    return (
      <AdminClient
        stats={serializedStats}
        organizations={serializedOrgs}
        globalSettings={serializedGlobal}
      />
    );
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
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
