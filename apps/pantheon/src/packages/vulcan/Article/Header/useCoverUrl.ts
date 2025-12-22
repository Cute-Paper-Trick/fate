import { useEffect, useState } from 'react';

import { useS3 } from '@/packages/s3';

export const useCoverUrl = (coverKey?: string, process?: string[]) => {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const { signature } = useS3();

  useEffect(() => {
    if (coverKey) {
      signature(
        coverKey,
        process ?? ['image', 'resize,limit_1,m_lfit,w_2000,h_2000', 'quality,q_90', 'format,webp'],
      ).then((signedUrl) => {
        setUrl(signedUrl);
      });
    }
  }, [coverKey, process, signature]);

  return url;
};
