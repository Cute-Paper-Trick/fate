'use client';

import { ActionIcon } from '@lobehub/ui';
import { AlignJustify, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors/systemStatus';

const AppNavigationDrawer = dynamic(() => import('./AppNavigationDrawer'), {
  ssr: false,
});

const BurgerButton = memo(() => {
  const showAppPanel = useGlobalStore(systemStatusSelectors.showAppPanel);
  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  return (
    <Center>
      <ActionIcon
        icon={showAppPanel ? X : AlignJustify}
        size={{ blockSize: 32, size: 20 }}
        onClick={() => updateSystemStatus({ showAppPanel: true })}
      />
      <AppNavigationDrawer />
    </Center>
  );
});

export default BurgerButton;
