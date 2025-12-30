import { useInfiniteQuery } from '@tanstack/react-query';

import { articlesReplies, commentsReplies } from '@/lib/http';

interface UseRepliesOptions {
  commentId?: number;
}

export const useCommentReplies = ({ commentId }: UseRepliesOptions) => {
  return useInfiniteQuery({
    enabled: !!commentId,
    queryKey: ['commentReplies', commentId],
    queryFn: async ({ pageParam = 1 }) => {
      return commentsReplies({ comment_id: commentId!, page: pageParam, size: 10 });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total / lastPage.size ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) => (firstPage.page > 1 ? firstPage.page - 1 : undefined),
    select: (data) => {
      return {
        replies: data.pages.flatMap((page) => page.replies),
        total: data.pages[0]?.total ?? 0,
      };
    },
  });
};

export const useArticleReplies = ({ articleId }: { articleId?: number }) => {
  return useInfiniteQuery({
    enabled: !!articleId,
    queryKey: ['articleReplies', articleId],
    queryFn: async ({ pageParam = 1 }) => {
      return articlesReplies({ article_id: articleId!, page: pageParam, size: 10 });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total / lastPage.size ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) => (firstPage.page > 1 ? firstPage.page - 1 : undefined),
    select: (data) => {
      return {
        replies: data.pages.flatMap((page) => page.replies),
        total: data.pages[0]?.total ?? 0,
      };
    },
  });
};
