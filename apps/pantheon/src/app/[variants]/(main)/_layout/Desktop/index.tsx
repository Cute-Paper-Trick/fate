'use client';

import { PropsWithChildren, Suspense, memo } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { Flexbox } from 'react-layout-kit';

const Layout = memo<PropsWithChildren>(({ children }) => {
  // const { isPWA } = usePlatform();
  return (
    <HotkeysProvider>
      <Flexbox horizontal height={'100%'} width="100%" style={{ position: 'relative' }}>
        <p>Desktop Layout(app/[variants]/(main)/_layout/Desktop)</p>
        {children}
      </Flexbox>
      <Suspense>{/* <RegisterHotkeys /> */}</Suspense>
    </HotkeysProvider>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
