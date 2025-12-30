'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import styles from './layout.module.scss';

interface AgoraLayoutProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  content?: React.ReactNode;
}

const AgoraLayout = memo<AgoraLayoutProps>(({ left, right, content }) => {
  return (
    <section className={cx(styles.layout)}>
      <aside className={styles.sideLeft}>{left}</aside>
      <main className={styles.mainContent}>{content}</main>
      <aside className={styles.sideRight}>{right}</aside>
    </section>
  );
});

AgoraLayout.displayName = 'AgoraLayout';

export default AgoraLayout;
