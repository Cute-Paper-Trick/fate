import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const appEnv = createEnv({
  server: {
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: z.boolean().default(true),
    CERBERUS_URL: z.url().optional(),
  },
  client: {
    NEXT_PUBLIC_CERBERUS_URL: z.url().optional(),
    NEXT_PUBLIC_BACKEND_URL: z.url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: process.env.MIDDLEWARE_REWRITE_THROUGH_LOCAL === '1',
    CERBERUS_URL: process.env.CERBERUS_URL || 'http://localhost:5090',
    NEXT_PUBLIC_CERBERUS_URL: process.env.NEXT_PUBLIC_CERBERUS_URL || 'http://localhost:5090',
  },
});
