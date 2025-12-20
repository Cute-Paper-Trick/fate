import OSS from 'ali-oss';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { s3Env } from '@/envs/s3';

const signature = (
  name: string,
  process: string[] = [
    'image',
    'resize,limit_1,m_lfit,w_2000,h_2000',
    'quality,q_90',
    'format,webp',
  ],
) => {
  const endpoint = s3Env.NEXT_PUBLIC_S3_ENDPOINT;

  if (!name) return '';

  if (process.length) {
    return `${endpoint}${name}?x-oss-process=${process.join('/')}`;
  }

  return `${endpoint}${name}`;
};

export const useS3 = () => {
  const [client] = useState(
    new OSS({
      region: s3Env.NEXT_PUBLIC_S3_REGION,
      bucket: s3Env.NEXT_PUBLIC_S3_BUCKET,
      accessKeyId: s3Env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      accessKeySecret: s3Env.NEXT_PUBLIC_S3_ACCESS_KEY_SECRET,
    }),
  );

  const multipartUpload = async (file: File) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const name = `${s3Env.NEXT_PUBLIC_S3_PREFIX}/${nanoid()}${suffix}`;

    const res = await client.multipartUpload(name, file, {});
    return res;
  };

  return { client, multipartUpload, signature };
};
