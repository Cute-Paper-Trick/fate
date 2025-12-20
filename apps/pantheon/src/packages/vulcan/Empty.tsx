import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  muted: css`
    margin: 1.875rem auto;
    font-weight: 700;
    color: #c7c7cc;
    text-align: center;

    height: 180px;
  `,
}));

const ContentEmpty = memo(() => {
  const { styles } = useStyles();

  return (
    <Center className={styles.muted}>
      <span>还没有内容，敬请期待</span>
    </Center>
  );
});

export default ContentEmpty;
