'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import TopicMenu from './TopicMenu';

interface TopicSideMenuProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const TopicSideMenu = memo((props: TopicSideMenuProps) => {
  return (
    <Flexbox gap={20} style={{ minHeight: '100%', marginTop: 30 }}>
      <TopicMenu setTab={props.onTabChange} tab={props.currentTab} />
    </Flexbox>
  );
});

export default TopicSideMenu;
