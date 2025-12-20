import { Block } from '@blocknote/core';
import { skipToken, useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { contentsDetail } from '@/lib/http';
import { useArticleStore } from '@/store/article';

export const useDarftInit = () => {
  const [id] = useQueryState('id', parseAsInteger);
  const [initialized, initDraft] = useArticleStore((s) => [s.initialized, s.initDraft]);

  console.log('useDarftInit id', id);

  // 新建草稿，直接标记初始化完成
  useEffect(() => {
    if (!id) initDraft({});
  }, [id, initDraft]);

  // 历史草稿，从服务器加载
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: id ? () => contentsDetail({ id }) : skipToken,
    select: (res) => res.content,
  });

  // 等待历史草稿数据加载完成后，初始化草稿状态
  useEffect(() => {
    // 自动保存新草稿触发的 id 变化，不需要重复初始化
    if (initialized) return;

    if (!data) {
      return;
    }

    initDraft({
      id: data.id,
      title: data.title,
      description: data.description ?? '',
      cover: data.cover_url ?? '',
      blocks: data.body as Block[] | undefined,
      type: data.type,
    });
  }, [initialized, data, initDraft]);

  return { isLoading };
};
