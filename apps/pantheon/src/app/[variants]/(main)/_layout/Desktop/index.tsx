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
      <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width="100%">
        {children}
      </Flexbox>
      <Suspense>{/* <RegisterHotkeys /> */}</Suspense>
    </HotkeysProvider>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
