'use client';

import { memo } from 'react';

import Menu from '@/components/Menu';

import { useMenu } from './useMenu';

interface CategoryContentProps {
  setTab: (tab: string) => void;
  tab: string;
}

const TopicMenu = memo<CategoryContentProps>(({ tab, setTab }) => {
  const cateItems = useMenu();
  return (
    <Menu
      compact
      items={cateItems}
      onClick={({ key }) => {
        console.log('TopicMenu onClick', key);
        setTab(key);
      }}
      selectable
      selectedKeys={[tab]}
    />
  );
});

export default TopicMenu;
