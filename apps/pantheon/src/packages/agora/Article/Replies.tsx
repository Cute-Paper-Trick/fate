import { Button, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Comment from '../comments/Comment';
import { useArticleReplies } from '../comments/hooks/useReplies';

const useStyles = createStyles(({ css }) => ({
  replies: css`
    padding: 2rem 2rem;
  `,
}));

const Replies = memo(() => {
  const { styles } = useStyles();

  const [id] = useQueryState('id', parseAsInteger);

  const { data, isLoading, hasNextPage, fetchNextPage } = useArticleReplies({ articleId: id! });

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Flexbox className={styles.replies} width={'100%'}>
      {data?.replies.map((reply) => (
        <Comment comment={reply} key={reply.id} />
      ))}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} type="link">
          加载更多...
        </Button>
      )}
    </Flexbox>
  );
});

export default Replies;
