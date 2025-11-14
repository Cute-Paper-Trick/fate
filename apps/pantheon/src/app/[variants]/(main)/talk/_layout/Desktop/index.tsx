'use client';

import { useTranslate } from '@tolgee/react';
import { useResponsive } from 'antd-style';
import { ReactNode, memo, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import Footer from '@/features/Setting/Footer';
import SettingContainer from '@/features/Setting/SettingContainer';

import Header from '../../../profile/_layout/Desktop/Header';
import SideBar from '../../../profile/_layout/Desktop/SideBar';

export interface LayoutProps {
  category: ReactNode;
  children: ReactNode;
}

const TalkLayout = memo<LayoutProps>(({ children, category }) => {
  const ref = useRef<any>(null);
  const { md = true } = useResponsive();
  const { t } = useTranslate('talk');
  return (
    <Flexbox
      height={'100%'}
      horizontal={md}
      ref={ref}
      style={{ position: 'relative' }}
      width={'100%'}
    >
      {md ? (
        <SideBar desc=" " title={t('topic.sidebar.title', '交流中心')}>
          {category}
        </SideBar>
      ) : (
        <Header getContainer={() => ref.current} title={<>{t(`tab.${'activeKey'}`)}</>}>
          {category}
        </Header>
      )}
      <SettingContainer addonAfter={<Footer />}>{children}</SettingContainer>
    </Flexbox>
  );
});

TalkLayout.displayName = 'DesktopTalkLayout';

export default TalkLayout;
