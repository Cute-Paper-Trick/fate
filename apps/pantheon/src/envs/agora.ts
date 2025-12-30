import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const agoraEnv = createEnv({
  client: {
    NEXT_PUBLIC_AGORA_S3_PREFIX: z.string(),
    NEXT_PUBLIC_AGORA_S3_BUCKET: z.string(),
    NEXT_PUBLIC_AGORA_S3_REGION: z.string(),
    NEXT_PUBLIC_AGORA_PUBLIC_DOMAIN: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_AGORA_S3_PREFIX: process.env.NEXT_PUBLIC_AGORA_S3_PREFIX,
    NEXT_PUBLIC_AGORA_S3_BUCKET: process.env.NEXT_PUBLIC_AGORA_S3_BUCKET,
    NEXT_PUBLIC_AGORA_S3_REGION: process.env.NEXT_PUBLIC_AGORA_S3_REGION,
    NEXT_PUBLIC_AGORA_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_AGORA_PUBLIC_DOMAIN,
  },
});
