import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const appEnv = createEnv({
  server: {
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: z.boolean().default(true),
  },
  runtimeEnv: {
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: process.env.MIDDLEWARE_REWRITE_THROUGH_LOCAL === '1',
  },
});
