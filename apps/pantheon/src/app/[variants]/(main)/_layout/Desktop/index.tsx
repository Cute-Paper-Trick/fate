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
      <AppNavigationDrawer />
      <TitleBar />
      <Flexbox
        direction="vertical"
        height={'100%'}
        id="#navigator-drawer-container"
        style={{ position: 'relative' }}
        width="100%"
      >
        {children}
      </Flexbox>
      <Suspense>{/* <RegisterHotkeys /> */}</Suspense>
    </Flexbox>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
