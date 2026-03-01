import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

const globalForDb = globalThis as unknown as {
  dbPool: Pool | undefined;
};

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: Env.DATABASE_URL,
  });
} else {
  if (!globalForDb.dbPool) {
    globalForDb.dbPool = new Pool({
      connectionString: Env.DATABASE_URL,
    });
  }
  pool = globalForDb.dbPool;
}

export const db = drizzle(pool, { schema });
