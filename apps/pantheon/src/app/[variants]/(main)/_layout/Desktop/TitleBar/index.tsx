'use client';

import { Header } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

// import Cerberus from '@/components/brand/Cerberus';
import Pantheon from '@/components/brand/Pantheon';

import BurgerButton from '../../../features/BurgerButton';
import Avatar from './Avatar';

// import CHeader from './Header';

const Nav = memo(() => {
  // const { t } = useTranslate('common');

  // const menu = (
  //   <Menu
  //     items={[
  //       { key: 'chat', label: <Link href="/chat">{t('page.chat')}</Link> },
  //       {
  //         key: 'talk',
  //         label: <Link href="/talk">{t('page.talk')}</Link>,
  //         onClick: () => console.log('click talk'),
  //       },
  //       { key: 'lab', label: <Link href="/lab">{t('page.lab')}</Link> },
  //       { key: 'task', label: <Link href="/task">{t('page.task')}</Link> },
  //     ]}
  //     mode="horizontal"
  //   />
  // );

  const left = (
    <Flexbox align="center" as={'section'} gap={8} horizontal>
      <BurgerButton />
      <Pantheon type={'combine'} />
    </Flexbox>
  );

  return (
    <>
      {/* <CHeader logo={<Pantheon type={'combine'} />}>HEADER</CHeader> */}
      <Header actions={<Avatar />} logo={left} />
      {/* <Header actions={<Avatar />} logo={<Cerberus type={'combine'} />} nav={menu} /> */}
      {/* <Flexbox align="center" as="section" /> */}
    </>
  );
});

Nav.displayName = 'DesktopTopNav';

export default Nav;
