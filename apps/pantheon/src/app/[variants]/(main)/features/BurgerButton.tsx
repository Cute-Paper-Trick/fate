'use client';

import { ActionIcon } from '@lobehub/ui';
import { AlignJustify, X } from 'lucide-react';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

const BurgerButton = memo(() => {
  const showAppPanel = useGlobalStore(systemStatusSelectors.showAppPanel);
  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  return (
    <Center>
      <ActionIcon
        icon={showAppPanel ? X : AlignJustify}
        onClick={() => updateSystemStatus({ showAppPanel: true })}
        size={{ blockSize: 32, size: 20 }}
      />
    </Center>
  );
});

export default BurgerButton;
