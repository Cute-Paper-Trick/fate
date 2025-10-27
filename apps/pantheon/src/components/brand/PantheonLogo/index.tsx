'use client';

import { Image } from '@lobehub/ui';
import { ImageProps } from 'antd';
import { memo } from 'react';

import { ImgProps } from '@/types';

type Logo3dProps = Omit<ImgProps & ImageProps, 'width' | 'height' | 'src'> & {
  size?: number | string;
};

const Logo3d = memo<Logo3dProps>(({ size = '1em', style, alt = 'LobeHub', ...rest }) => {
  return (
    <Image alt={alt} height={size} src={'pantheon.png'} style={style} width={size} {...rest} />
  );
});

Logo3d.displayName = 'PantheonLogo';

export default Logo3d;
