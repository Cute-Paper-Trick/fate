'use client';

import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import SetPassword from '@/features/User/SetPassword';
import VerifyEmail from '@/features/User/VerifyEmail';

import SideBar from './SideBar';
import TitleBar from './TitleBar';

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
        <Flexbox height={'calc(100% - 50px)'} horizontal width={'100%'}>
          <Flexbox
            height={'100%'}
            horizontal
            id="desktop-main-container"
            style={{ position: 'relative' }}
            width="100%"
          >
            <SideBar />
            <Flexbox width={'100%'} style={{ overflow: 'auto' }}>
              {children}
            </Flexbox>
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
