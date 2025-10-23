import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";
import { authEnv } from '@/envs/auth';

const connectionString = authEnv.DATABASE_URL;

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
