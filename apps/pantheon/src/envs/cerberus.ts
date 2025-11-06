import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      // ===== Better Auth ===== //
      DATABASE_URL?: string;
      BETTER_AUTH_API_KEY?: string;
    }
  }
}

export const authEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    APP_URL: z.url(),
    BETTER_AUTH_API_KEY_HEADER: z.string(),
    BETTER_AUTH_ADMIN_ROLES: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    BETTER_AUTH_API_KEY_HEADER: process.env.BETTER_AUTH_API_KEY_HEADER || 'x-api-key',
    BETTER_AUTH_ADMIN_ROLES: process.env.BETTER_AUTH_ADMIN_ROLES || 'admin, superadmin',
  },
});
