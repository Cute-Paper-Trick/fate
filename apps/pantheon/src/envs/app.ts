import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const appEnv = createEnv({
  server: {
    APP_URL: z.url(),
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: z.boolean().default(true),
    CERBERUS_URL: z.url().optional(),
    BACKEND_SECRET_CODE: z.string(),
  },
  client: {
    NEXT_PUBLIC_CERBERUS_URL: z.url().optional(),
    NEXT_PUBLIC_BACKEND_URL: z.url(),
    NEXT_PUBLIC_ENABLE_TRANS_TOOLS: z.boolean().optional(),
  },
  runtimeEnv: {
    BACKEND_SECRET_CODE: process.env.BACKEND_SECRET_CODE,
    APP_URL: process.env.APP_URL || 'http://localhost:5090',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: process.env.MIDDLEWARE_REWRITE_THROUGH_LOCAL === '1',
    CERBERUS_URL: process.env.CERBERUS_URL || 'http://localhost:5090',
    NEXT_PUBLIC_CERBERUS_URL: process.env.NEXT_PUBLIC_CERBERUS_URL || 'http://localhost:5090',
    NEXT_PUBLIC_ENABLE_TRANS_TOOLS: process.env.NEXT_PUBLIC_ENABLE_TRANS_TOOLS === '1',
  },
});
