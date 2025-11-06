'use client';

import { createStyles } from 'antd-style';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  main: css`
    overflow: auto;
    background-color: #f9fafb;
    color: #333;
    padding: 2rem;
    display: flex;
    justify-content: center;
  `,
  mainContainer: css`
    width: 100%;
  `,
}));
const DesktopBriefIntroduct = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();
  return (
    <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width="100%">
      <div className={styles.main}>
        <div className={styles.mainContainer}>{children}</div>
      </div>
    </Flexbox>
  );
});

DesktopBriefIntroduct.displayName = 'MobileBriefIntroduct';

export default DesktopBriefIntroduct;
