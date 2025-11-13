'use client';

import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import SetPassword from '@/features/User/SetPassword';
import VerifyEmail from '@/features/User/VerifyEmail';

import SideBar from './SideBar';
import TitleBar from './TitleBar';

// const AppNavigationDrawer = dynamic(() => import('../../features/AppNavigationDrawer'), {
//   ssr: false,
// });

const Layout = memo<PropsWithChildren>(({ children }) => {
  return (
    <>
      <Flexbox
        height={'100%'}
        id="root-layout"
        style={{ height: '100vh', position: 'relative', borderTop: undefined }}
        width={'100%'}
      >
        <TitleBar />
        {/* <Flexbox horizontal height={'100%'} width={'100%'}>
          <SideBar />
          <Flexbox width={'100%'}>
            <TitleBar />
            {children}
          </Flexbox>
        </Flexbox> */}
        <Flexbox height={'calc(100% - 50px)'} horizontal width={'100%'}>
          {/* <AppNavigationDrawer /> */}
          <Flexbox
            // direction="vertical"
            height={'100vh'}
            horizontal
            id="desktop-main-container"
            style={{ position: 'relative', overflowY: 'auto' }}
            width="100%"
          >
            <SideBar />
            {children}
          </Flexbox>
        </Flexbox>
      </Flexbox>
      <VerifyEmail />
      <SetPassword />
    </>
  );
});

Layout.displayName = 'DesktopLayout';

export default Layout;
