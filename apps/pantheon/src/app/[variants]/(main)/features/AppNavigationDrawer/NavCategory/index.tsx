'use client';

import { memo } from 'react';

import Menu from '@/components/Menu';
import { AppFuncs } from '@/store/global/initialState';

import { useCategory } from './useCategory';

interface CategoryContentProps {
  setTab: (tab: AppFuncs) => void;
  tab: string;
}

const NavCategory = memo<CategoryContentProps>(({ tab, setTab }) => {
  const cateItems = useCategory();
  return (
    <Menu
      compact
      items={cateItems}
      onClick={({ key }) => {
        console.log('NavCategory onClick', key);
        setTab(key as AppFuncs);
      }}
      selectable
      selectedKeys={[tab]}
    />
  );
});

export default NavCategory;
