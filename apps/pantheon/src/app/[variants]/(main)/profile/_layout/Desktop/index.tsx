'use client';

import { useTranslate } from '@tolgee/react';
import { useResponsive } from 'antd-style';
import { memo, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import Footer from '@/features/Setting/Footer';
import SettingContainer from '@/features/Setting/SettingContainer';

// import Footer from '@/features/Setting/Footer';
// import SettingContainer from '@/features/Setting/SettingContainer';
// import { useActiveProfileKey } from '@/hooks/useActiveTabKey';
import { LayoutProps } from '../type';
import Header from './Header';
import SideBar from './SideBar';

const Layout = memo<LayoutProps>(({ children, category }) => {
  const ref = useRef<any>(null);
  const { md = true } = useResponsive();
  const { t } = useTranslate('profile');
  // const activeKey = useActiveProfileKey();

  return (
    <Flexbox
      height={'100%'}
      horizontal={md}
      ref={ref}
      style={{ position: 'relative' }}
      width={'100%'}
    >
      {md ? (
        <SideBar>{category}</SideBar>
      ) : (
        <Header getContainer={() => ref.current} title={<>{t(`tab.${'activeKey'}`)}</>}>
          111{category}
        </Header>
      )}
      <SettingContainer
        addonAfter={<Footer />}
        style={{
          paddingBlock: 24,
          paddingInline: 32,
        }}
      >
        {children}
      </SettingContainer>
    </Flexbox>
  );
});

Layout.displayName = 'DesktopProfileLayout';

export default Layout;
