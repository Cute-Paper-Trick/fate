import { LobeHubProps } from '@lobehub/ui/brand';
import { memo } from 'react';

import Pantheon from '@/components/brand/Pantheon';

// import CustomLogo from './Custom';

// import { isCustomBranding } from '@/const/version';
// const isCustomBranding = false;

interface ProductLogoProps extends LobeHubProps {
  height?: number;
  width?: number;
}

export const ProductLogo = memo<ProductLogoProps>((props) => {
  // if (isCustomBranding) {
  //   return <CustomLogo {...props} />;
  // }

  return <Pantheon {...props} />;
});
