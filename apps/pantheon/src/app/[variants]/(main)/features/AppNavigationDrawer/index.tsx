'use client';

import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import BrandWatermark from '@/components/BrandWatermark';

import CategoryContent from './CategoryContent';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding-block: 0 16px;
    padding-inline: 12px;
    padding-top: 20px;
    border-inline-end: 1px solid ${token.colorBorderSecondary};
    background: ${token.colorBgLayout};
  `,
}));

const AppNavigationDrawer = memo(() => {
  const { cx, styles } = useStyles();
  return (
    <Flexbox className={cx(styles.container)} flex={'none'} gap={20}>
      <CategoryContent />
      <BrandWatermark paddingInline={12} />
    </Flexbox>
  );
});

export default AppNavigationDrawer;
