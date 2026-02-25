import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite, type PgliteDatabase } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Pool } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

let dbInstance: any;

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
  const globalDb = globalThis as unknown as { hoodPgPool: Pool; hoodPgDrizzle: any };

  if (!globalDb.hoodPgPool) {
    globalDb.hoodPgPool = new Pool({
      connectionString: Env.DATABASE_URL,
      max: process.env.NODE_ENV === 'development' ? 2 : 10,
    });
    
    globalDb.hoodPgDrizzle = drizzlePg(globalDb.hoodPgPool, { schema });
    
    try {
      await migratePg(globalDb.hoodPgDrizzle, {
        migrationsFolder: path.join(process.cwd(), 'migrations'),
      });
    } catch (error) {
      console.warn('Migration warning (safe to ignore in dev if already migrated):', error);
    }
  }

  dbInstance = globalDb.hoodPgDrizzle;
} else {
  // Stores the pglite connection in the global scope to prevent multiple instances due to hot reloading with Next.js
  const globalDb = globalThis as unknown as { hoodPgliteClient: PGlite; hoodPgliteDrizzle: PgliteDatabase<typeof schema> };

  if (!globalDb.hoodPgliteClient) {
    globalDb.hoodPgliteClient = new PGlite();
    await globalDb.hoodPgliteClient.waitReady;

    globalDb.hoodPgliteDrizzle = drizzlePglite(globalDb.hoodPgliteClient, { schema });
    
    await migratePglite(globalDb.hoodPgliteDrizzle, {
      migrationsFolder: path.join(process.cwd(), 'migrations'),
    });
  }

  dbInstance = globalDb.hoodPgliteDrizzle;
}

export const db = dbInstance;
