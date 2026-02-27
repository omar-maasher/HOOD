import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

declare global {
    var dbPool: Pool | undefined;
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: Env.DATABASE_URL,
    });
} else {
    if (!global.dbPool) {
        global.dbPool = new Pool({
            connectionString: Env.DATABASE_URL,
        });
    }
    pool = global.dbPool;
}

export const db = drizzle(pool, { schema });
