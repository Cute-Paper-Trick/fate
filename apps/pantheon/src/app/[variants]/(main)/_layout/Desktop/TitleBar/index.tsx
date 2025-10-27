import { Avatar, Header, Menu } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Cerberus from '@/components/brand/Cerberus';
import Pantheon from '@/components/brand/Pantheon';

import BurgerButton from '../../../features/BurgerButton';

const Nav = memo(() => {
  const menu = (
    <Menu
      mode="horizontal"
      items={[
        { key: '1', label: 'Menu Item 1' },
        { key: '2', label: 'Menu Item 2' },
        { key: '3', label: 'Menu Item 3' },
      ]}
    />
  );

  const actions = (
    <>
      <Avatar avatar="💩" />
    </>
  );

  const left = (
    <Flexbox as={'section'} horizontal align="center" gap={8}>
      <BurgerButton />
      <Pantheon type={'combine'} />
    </Flexbox>
  );

  return (
    <>
      <Header actions={actions} logo={left} />
      <Header actions={actions} logo={<Cerberus type={'combine'} />} nav={menu} />
    </>
  );
});

Nav.displayName = 'DesktopTopNav';

export default Nav;
