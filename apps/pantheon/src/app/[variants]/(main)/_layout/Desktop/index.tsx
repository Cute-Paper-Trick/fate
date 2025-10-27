'use client';

import { PropsWithChildren, Suspense, memo } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { Flexbox } from 'react-layout-kit';

import TitleBar from './TitleBar';

const Layout = memo<PropsWithChildren>(({ children }) => {
  // const { isPWA } = usePlatform();
  return (
    <HotkeysProvider>
      <TitleBar />
      <Flexbox horizontal height={'100%'} width="100%" style={{ position: 'relative' }}>
        {children}
      </Flexbox>
      <Suspense>{/* <RegisterHotkeys /> */}</Suspense>
    </HotkeysProvider>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
