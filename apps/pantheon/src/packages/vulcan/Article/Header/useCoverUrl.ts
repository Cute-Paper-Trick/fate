import { s3Env } from '@/envs/s3';

export const useCoverUrl = (coverKey?: string) => {
  const endpoint = s3Env.NEXT_PUBLIC_S3_ENDPOINT;
  const process = 'image/resize,limit_1,m_lfit,w_2000,h_2000/quality,q_90/format,webp';

  if (!coverKey) return undefined;

  return `${endpoint}${coverKey}?x-oss-process=${process}`;
};
