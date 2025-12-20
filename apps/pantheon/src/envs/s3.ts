import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const s3Env = createEnv({
  client: {
    NEXT_PUBLIC_S3_ENDPOINT: z.url(),
    NEXT_PUBLIC_S3_REGION: z.string(),
    NEXT_PUBLIC_S3_BUCKET: z.string(),
    NEXT_PUBLIC_S3_ACCESS_KEY_ID: z.string(),
    NEXT_PUBLIC_S3_ACCESS_KEY_SECRET: z.string(),
    NEXT_PUBLIC_S3_PREFIX: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_S3_ENDPOINT: process.env.NEXT_PUBLIC_S3_ENDPOINT,
    NEXT_PUBLIC_S3_REGION: process.env.NEXT_PUBLIC_S3_REGION,
    NEXT_PUBLIC_S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET,
    NEXT_PUBLIC_S3_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    NEXT_PUBLIC_S3_ACCESS_KEY_SECRET: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_SECRET,
    NEXT_PUBLIC_S3_PREFIX: process.env.NEXT_PUBLIC_S3_PREFIX,
  },
});
