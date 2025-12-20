import { useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { commentsList } from '@/lib/http';

import UserComment from './comment';

const Comments = memo<{ articleId: number }>(({ articleId }) => {
  const { data, isPending } = useInfiniteQuery({
    queryKey: ['article', articleId, 'comments'],
    queryFn: ({ pageParam }) => {
      return commentsList({ target_id: articleId, target_type: 0, page: pageParam.page, size: 10 });
    },
    initialPageParam: { page: 1 },
    getNextPageParam: (lastPage) => ({ page: lastPage.page + 1 }),
    getPreviousPageParam: (firstPage) => ({ page: firstPage.page - 1 }),
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <Flexbox>
      {comments.map((comment) => (
        <UserComment
          articleId={articleId}
          comment={comment}
          key={comment.id}
          parentId={0}
          rootId={comment.id}
        />
      ))}
      {isPending ? <Skeleton paragraph={{ rows: 4 }} /> : null}
    </Flexbox>
  );
});

export default Comments;
