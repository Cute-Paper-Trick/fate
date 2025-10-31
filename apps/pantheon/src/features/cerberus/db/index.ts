import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import { authEnv } from '@/envs/cerberus';

import * as schema from './schema';

const connectionString = authEnv.DATABASE_URL;

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
