'use client';

import { Header } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import PantheonLogo from '@/components/brand/PantheonLogo';
import PantheonText from '@/components/brand/PantheonText';

import Avatar from './Avatar';

const Nav = memo(() => {
  return (
    <Header
      actions={<Avatar />}
      logo={
        <Flexbox align="center" gap={8} horizontal>
          <PantheonLogo alt="Pantheon" size={34} />
          <PantheonText size={28} />
        </Flexbox>
      }
      style={{ paddingLeft: 12 }}
    />
  );
});

Nav.displayName = 'DesktopTopNav';

export default Nav;
