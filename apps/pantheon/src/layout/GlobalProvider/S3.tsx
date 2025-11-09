'use client';

import { PropsWithChildren, useEffect } from 'react';

import { useS3Store } from '@/store/s3';

const S3Provider = ({ children }: PropsWithChildren) => {
  const refreshStsToken = useS3Store((s) => s.refreshSTSToken);

  useEffect(() => {
    console.log('OSS 初始化');
    refreshStsToken();
  }, [refreshStsToken]);

  return children;
};

export default S3Provider;
