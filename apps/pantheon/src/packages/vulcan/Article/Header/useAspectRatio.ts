'use client';

import { useEffect, useState } from 'react';

async function getImageAspectRatio(imgUrl?: string): Promise<number> {
  if (!imgUrl) return 0;

  return new Promise<number>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      console.log(`wh: ${img.width}x${img.height}, rate: ${ratio.toFixed(2)}`);
      resolve(ratio);
    };

    img.onerror = () => {
      reject(new Error('无法加载网络图片'));
    };

    img.src = imgUrl;
  });
}

export const useAspectRatio = (imgUrl?: string) => {
  const [rate, setRate] = useState(0);

  useEffect(() => {
    async function _inner() {
      const _rate = await getImageAspectRatio(imgUrl);
      setRate(_rate);
    }

    _inner();
  }, [imgUrl]);

  return rate;
};
