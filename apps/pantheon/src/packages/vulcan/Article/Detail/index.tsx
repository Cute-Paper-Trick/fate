'use client';

import { Skeleton } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useCommentsCreate, useContentsDetail } from '@/lib/http';
import { queryClient } from '@/lib/query';
import { useS3 } from '@/packages/s3';

import Comments from '../Comments';
import Reply from '../Comments/Replay';
import Editor, { Block } from '../Editor';
import ArticleHeaderReadonly from '../Header/readonly';
import { Target } from '../types';
import { useStyles } from './styles';

const ArticleDetail = memo<{ id?: number }>(({ id }) => {
  const s3 = useS3();
  const { styles } = useStyles();

  const createMutation = useCommentsCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['article', Number(id), 'comments'] });
      },
    },
  });

  const onFinish = (text: string) => {
    createMutation.mutate({
      data: {
        content: text,
        target_id: Number(id),
        target_type: Target.Article,
        parent_id: 0,
        root_id: 0,
      },
    });
  };

  const { data, isPending } = useContentsDetail({ id: id! }, { query: { enabled: !!id } });

  const content = data?.content;

  return (
    <Flexbox className="draft" style={{ paddingBottom: '1.75rem' }}>
      <ArticleHeaderReadonly
        cover={content?.cover_url ?? ''}
        createdAt={content?.created_at ?? ''}
        creatorAvatar={content?.creator_avatar ?? ''}
        creatorName={content?.creator_name ?? ''}
        description={content?.description ?? ''}
        loading={isPending}
        title={content?.title ?? ''}
      />
      <div className={styles.content}>
        {isPending ? (
          <Skeleton paragraph={{ rows: 10 }} />
        ) : (
          <Editor
            editable={false}
            initialContent={content?.body as Block[] | undefined}
            resolveFileUrl={async (url) => {
              if (url.startsWith('http')) {
                return url;
              }
              return s3.signature(url);
            }}
          />
        )}
        <div style={{ height: '1rem' }} />
        <Reply onFinish={onFinish} />
        <div style={{ height: '1rem' }} />
        <Comments articleId={Number(id)} />
      </div>
    </Flexbox>
  );
});

export default ArticleDetail;
