import { nanoid } from 'nanoid';

import { agoraEnv } from '@/envs/agora';

export const genFilePath = (filename: string) => {
  const suffix = filename.slice(filename.lastIndexOf('.'));
  return `${agoraEnv.NEXT_PUBLIC_AGORA_S3_PREFIX}/articles/${nanoid()}${suffix}`;
};
