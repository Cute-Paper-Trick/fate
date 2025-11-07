'use client';

import { createStyles } from 'antd-style';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  main: css`
    width: 100%;
    padding: 4rem 2rem;
    position: relative;
  `,
  list: css`
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 1);
    position: relative;
    bottom: 15px;
    box-sizing: border-box;
    padding: 1.5rem;
  `,
}));

const DesktopLearning = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();

  return (
    <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width="100%">
      <div className={styles.main}>
        <div className={styles.list}>{children}</div>
      </div>
    </Flexbox>
  );
});

DesktopLearning.displayName = 'DesktopLearning';

export default DesktopLearning;
