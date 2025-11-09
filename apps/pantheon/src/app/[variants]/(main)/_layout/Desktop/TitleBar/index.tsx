'use client';

import { Header } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

import { ProductLogo } from '@/components/Branding';
import { AppTab } from '@/store/global/initialState';

// import Pantheon from '@/components/brand/Pantheon';
import Avatar from './Avatar';

const Nav = memo(() => {
  const { t } = useTranslate('common');
  const pathname = usePathname();
  const activeTab = pathname.split('/').at(-1);

  const isActive = Object.values(AppTab).includes(activeTab as AppTab);

  return (
    <>
      {/* <CHeader logo={<Pantheon type={'combine'} />}>HEADER</CHeader> */}
      <Header
        actions={<Avatar />}
        logo={<ProductLogo extra={isActive ? t(`tab.${activeTab}`) : undefined} type="combine" />}
      />
    </>
  );
});

Nav.displayName = 'DesktopTopNav';

export default Nav;
