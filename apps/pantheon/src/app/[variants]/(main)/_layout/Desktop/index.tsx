'use client';

import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit/lib/Flexbox';

const Layout = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox horizontal height={'100%'} width="100%">
      <p>Desktop Layout(app/[variants]/(main)/_layout/Desktop)</p>
      {children}
    </Flexbox>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
