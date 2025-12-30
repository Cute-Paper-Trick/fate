import { createStyles } from 'antd-style';
import { rgba } from 'polished';
import { memo } from 'react';

const useStyles = createStyles(({ css }, { color }: { color: string }) => ({
  tag: css`
    padding: 0.25rem 0.5rem;
    cursor: default;
    border-radius: var(--radius);
    border: 1px solid transparent;

    & > span {
      color: ${color};
    }

    &:hover {
      border: 1px solid ${color};
      background-color: ${rgba(color, 0.1)};
    }
  `,
}));

interface ArticleTagProps {
  color: string;
  name: string;
}

const ArticleTag = memo<ArticleTagProps>(({ color, name }) => {
  const { styles } = useStyles({ color });

  return (
    <div className={styles.tag}>
      <span>#</span>
      {name}
    </div>
  );
});

export default ArticleTag;
