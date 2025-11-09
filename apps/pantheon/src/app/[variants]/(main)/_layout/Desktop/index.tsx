'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren, Suspense, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import TitleBar from './TitleBar';

const AppNavigationDrawer = dynamic(() => import('../../features/AppNavigationDrawer'), {
  ssr: false,
});

const Layout = memo<PropsWithChildren>(({ children }) => {
  // const { isPWA } = usePlatform();
  return (
    <Flexbox
      direction="vertical"
      height={'100%'}
      style={{ height: '100vh', position: 'relative', borderTop: undefined }}
      width={'100%'}
    >
      <TitleBar />
      <Flexbox height={'calc(100% - 50px)'} horizontal width={'100%'}>
        <AppNavigationDrawer />
        <Flexbox
          direction="vertical"
          height={'100%'}
          id="desktop-main-container"
          style={{ position: 'relative', overflowY: 'auto' }}
          width="100%"
        >
          {children}
        </Flexbox>
      </Flexbox>
      <Suspense>{/* <RegisterHotkeys /> */}</Suspense>
    </Flexbox>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
