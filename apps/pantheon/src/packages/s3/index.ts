import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useStore } from 'zustand';

import { s3Env } from '@/envs/s3';

import { ossStore } from './store';

export const useS3 = () => {
  const store = useStore(ossStore);

  useEffect(() => {
    store.refreshSTSToken();
  }, []);

  const multipartUpload = async (file: File) => {
    await store.ensureSTS();

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const name = `${s3Env.NEXT_PUBLIC_S3_PREFIX}/${nanoid()}${suffix}`;

    const res = await store.getClient().multipartUpload(name, file, {});
    return res;
  };

  const signature = async (
    name: string,
    process: string[] = [
      'image',
      'resize,limit_1,m_lfit,w_2000,h_2000',
      'quality,q_90',
      'format,webp',
    ],
  ) => {
    await store.ensureSTS();

    const processStr = process.length ? process.join('/') : '';
    return store.getClient().signatureUrl(name, { process: processStr });
  };

  return { multipartUpload, signature };
};
