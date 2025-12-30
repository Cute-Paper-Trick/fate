import { createStyles } from 'antd-style';
import { PropsWithChildren, memo } from 'react';

const useStyles = createStyles(({ css }) => ({
  title: css`
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    overflow-y: clip;
  `,
}));

const ArticleTitle = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();

  return <h1 className={styles.title}>{children}</h1>;
});

export default ArticleTitle;
