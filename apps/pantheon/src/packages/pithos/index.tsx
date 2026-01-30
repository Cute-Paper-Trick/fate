import { MultipartUploadOptions } from 'ali-oss';
import { Image, ImageProps, Skeleton } from 'antd';
import { forwardRef, memo, useEffect, useState } from 'react';

import { agoraEnv } from '@/envs/agora';

import { useOssStsStore } from './store';

export const useUpload = () => {
  const getClient = useOssStsStore((s) => s.getClient);

  const multipartUpload = async (key: string, file: File, options?: MultipartUploadOptions) => {
    const client = await getClient();
    const res = await client.multipartUpload(key, file, options ?? {});
    return res;
  };

  return { multipartUpload };
};

export const useSignature = () => {
  const getClient = useOssStsStore((s) => s.getClient);
  const signature = async (name: string, process: string[] = [], publicRead = false) => {
    if (publicRead) {
      const url = new URL(name, agoraEnv.NEXT_PUBLIC_AGORA_PUBLIC_DOMAIN);
      if (process.length) {
        url.searchParams.set('x-oss-process', process.join('/'));
      }
      return url.toString();
    }

    const client = await getClient();
    return client.signatureUrl(name, { process: process?.join('/') });
  };

  return { signature };
};

interface RemoteIamgeProps extends Omit<ImageProps, 'src'> {
  src: string;
  process?: string[];
}

export const RemoteImage = memo(
  forwardRef<HTMLImageElement, RemoteIamgeProps>(({ src, alt, process, ...rest }) => {
    const { signature } = useSignature();
    const [realSrc, setRealSrc] = useState<string>(src);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (src.startsWith('http')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
        return;
      }

      setLoading(true);
      signature(src, process, true).then((url) => {
        setRealSrc(url);
        setLoading(false);
      });
    }, [src]);

    if (loading) {
      return <Skeleton.Image />;
    }

    return <Image src={realSrc} {...rest} alt={alt} />;
  }),
);

interface RemoteWrapperProps {
  path: string;
  process?: string[];
  avatar?: boolean;
  children: (src: string, loading: boolean) => React.ReactNode;
}

const formatPath = (filePath: string, avatar?: boolean) => {
  let res = filePath;
  if (res.startsWith('http')) {
    return res;
  }
  // lobe 头像地址转换
  if (res.startsWith('/webapi') || res.startsWith('webapi')) {
    res = res.replace?.('webapi', 'lobe-goood-space');
    return res;
  }

  if (avatar) {
    if (res.startsWith('lobe-goood-space') || res.startsWith('/lobe-goood-space')) {
      return res;
    }
    return `lobe-goood-space/${res}`;
  }

  return res;
};

export const RemoteWrapper = memo<RemoteWrapperProps>(({ path, process, children, avatar }) => {
  const { signature } = useSignature();
  const [realSrc, setRealSrc] = useState<string>(formatPath(path, avatar));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!realSrc || realSrc.startsWith('http')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    setLoading(true);
    signature(realSrc, process, true).then((url) => {
      setRealSrc(url);
      setLoading(false);
    });
  }, [realSrc, process]);

  if (loading) {
    return <Skeleton />;
  }

  return children(realSrc, loading);
});
