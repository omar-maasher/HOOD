import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

const pool = new Pool({
  connectionString: Env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
