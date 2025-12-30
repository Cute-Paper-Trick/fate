import { FluentEmoji } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const emjioSize = 24;

const useStyles = createStyles(({ css }) => ({
  reaction: css`
    gap: 0.375rem;
  `,
  reactionCount: css`
    min-width: 28px;
  `,
}));

interface ReactionProps {
  category: {
    cate: string;
    emjio: string;
    desc: string;
  };
  count?: number;
  layout?: 'horizontal' | 'vertical';
}

const Reaction = memo<ReactionProps>(({ category, count, layout = 'horizontal' }) => {
  const { styles } = useStyles();

  if (!count) {
    return null;
  }

  return (
    <Flexbox
      align="center"
      data-category={category.cate}
      data-emoji={category.desc}
      horizontal
      key={category.cate}
    >
      <Flexbox
        align="center"
        className={styles.reaction}
        data-category={category.cate}
        data-emoji={category.desc}
        direction={layout}
      >
        <FluentEmoji emoji={category.emjio} size={emjioSize} type="anim" />
        <span className={styles.reactionCount}>{count}</span>
      </Flexbox>
    </Flexbox>
  );
});

export default Reaction;
