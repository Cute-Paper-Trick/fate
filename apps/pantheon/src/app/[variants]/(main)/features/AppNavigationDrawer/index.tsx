'use client';

import { Drawer } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import NavCategory from './NavCategory';

const AppNavigationDrawer = memo(() => {
  const [showAppPanel, updateSystemStatus] = useGlobalStore((s) => [
    systemStatusSelectors.showAppPanel(s),
    s.updateSystemStatus,
  ]);

  return (
    <Drawer
      noHeader
      placement={'left'}
      open={showAppPanel}
      onClose={() => updateSystemStatus({ showAppPanel: false })}
      // sidebar={<></>}
      // sidebarWidth={180}
    >
      <Flexbox gap={20} style={{ minHeight: '100%', marginTop: 30 }}>
        <NavCategory setTab={() => {}} tab={'chat'} />
      </Flexbox>
      {/* 这是全局菜单 */}
    </Drawer>
  );
});

export default AppNavigationDrawer;
