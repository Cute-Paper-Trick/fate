import { type LobeHubProps } from '@lobehub/ui/brand';
import { memo } from 'react';

import Pantheon from '@/components/brand/Pantheon';

// import { ORG_NAME } from '@/const/branding';
// import { isCustomORG } from '@/const/version';

export const OrgBrand = memo<LobeHubProps>((props) => {
  // if (isCustomORG) {
  //   return <span>{ORG_NAME}</span>;
  // }

  return <Pantheon {...props} />;
});
