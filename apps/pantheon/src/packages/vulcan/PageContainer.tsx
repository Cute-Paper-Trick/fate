import { createStyles } from 'antd-style';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  container: css`
    padding-bottom: 2.5rem;
    padding-top: 1.25rem;
    background-color: #f7f7f8;
  `,
}));

const PageContainer = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();
  return <Flexbox className={styles.container}>{children}</Flexbox>;
});

export default PageContainer;
