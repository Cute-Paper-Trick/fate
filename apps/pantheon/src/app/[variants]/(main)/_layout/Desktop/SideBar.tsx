'use client';

import { SideNav } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Suspense, memo } from 'react';

import { useActiveTabKey } from '@/hooks/useActiveTabKey';

import TopActions from './TopActions';

const Top = () => {
  const sidebarKey = useActiveTabKey();

  return <TopActions tab={sidebarKey} />;
};

const Nav = memo(() => {
  const theme = useTheme();

  return (
    <SideNav
      bottomActions={undefined}
      style={{
        height: '100%',
        zIndex: 100,
        background: theme.colorBgLayout,
      }}
      topActions={
        <Suspense>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 150px)',
            }}
          >
            <Top />
          </div>
        </Suspense>
      }
    />
  );
});

Nav.displayName = 'DesktopNav';

export default Nav;
