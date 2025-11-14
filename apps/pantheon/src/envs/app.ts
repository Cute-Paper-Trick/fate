import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const appEnv = createEnv({
  server: {
    APP_URL: z.url(),
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: z.boolean().default(true),
    BACKEND_SECRET_CODE: z.string(),
    COOKIE_DOMAIN: z.string(),
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.url(),
    NEXT_PUBLIC_ENABLE_TRANS_TOOLS: z.boolean().optional(),
    NEXT_PUBLIC_CHAT_APP_URL: z.string(),
  },
  runtimeEnv: {
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    BACKEND_SECRET_CODE: process.env.BACKEND_SECRET_CODE,
    NEXT_PUBLIC_CHAT_APP_URL: process.env.NEXT_PUBLIC_CHAT_APP_URL,
    APP_URL: process.env.APP_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: process.env.MIDDLEWARE_REWRITE_THROUGH_LOCAL === '1',
    NEXT_PUBLIC_ENABLE_TRANS_TOOLS: process.env.NEXT_PUBLIC_ENABLE_TRANS_TOOLS === '1',
  },
});
