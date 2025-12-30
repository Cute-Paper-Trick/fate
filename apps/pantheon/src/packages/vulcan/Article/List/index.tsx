'use client';

import { Grid } from '@lobehub/ui';
import Link from 'next/link';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { modal } from '@/components/AntdStaticMethods';
import { useSession } from '@/features/cerberus/client';
import { useContentsList, useContentsPublish, useContentsUnpublish } from '@/lib/http';
import { queryClient } from '@/lib/query';

import Container from '../../Container';
import ContentEmpty from '../../Empty';
import ListLoading from '../../ListLoading';
import PageContainer from '../../PageContainer';
import Pagination from '../../Pagination';
import ArticleCard from '../Card';

interface ArticleListProps {
  status?: 'draft' | 'published';
}

const ArticleList = memo<ArticleListProps>(({ status }) => {
  const { data: sessionData } = useSession();
  const editable = sessionData?.user.role === 'creator';

  const [page] = useQueryState('page', { ...parseAsInteger, defaultValue: 1 });
  const [collectionId] = useQueryState('collectionId', parseAsInteger);

  const { data, isPending } = useContentsList({
    page: page,
    size: 12,
    collection_id: collectionId || undefined,
    status,
  });

  const publishMutation = useContentsPublish({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [{ url: '/api/contents/list' }] }),
    },
  });
  const unPublishMutation = useContentsUnpublish({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [{ url: '/api/contents/list' }] }),
    },
  });

  const onPublish = (id: number) => {
    modal.confirm({
      title: '确认发布这篇文章吗？',
      content: '发布后，文章将出现在公开列表中，所有用户均可查看。',
      onOk: () => publishMutation.mutate({ data: { id } }),
    });
  };

  const onUnpublish = (id: number) => {
    modal.confirm({
      title: '确认取消发布这篇文章吗？',
      content: '取消发布后，文章将不会出现在公开列表中，但仍可在草稿箱中查看和编辑。',
      onOk: () => unPublishMutation.mutate({ data: { id } }),
    });
  };

  if (isPending) {
    return (
      <PageContainer>
        <Container>
          <ListLoading />
        </Container>
      </PageContainer>
    );
  }

  return (
    <Flexbox className="article-list" height={'100%'} width={'100%'}>
      <PageContainer>
        <Container>
          {!data?.contents.length && !editable && <ContentEmpty />}
          <Grid maxItemWidth={'220px'} rows={4} width={'100%'}>
            {editable && (
              <Link href="/agora/article/edit">
                <ArticleCard
                  commentCount={0}
                  cover="https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/new-collection-cover.png?x-process=image/resize,m_lfit,w_313/quality,q_90/format,webp"
                  description="创建一篇新的文章"
                  id={0}
                  likeCount={0}
                  title="新建文章"
                  viewCount={0}
                />
              </Link>
            )}
            {data?.contents.map((article) => (
              <Link
                href={`/agora/article/detail?id=${article.id}`}
                key={article.id}
                style={{ color: 'unset', position: 'relative' }}
              >
                {editable && article.status === 'draft' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      zIndex: 1,
                    }}
                  >
                    草稿
                  </span>
                )}
                <ArticleCard
                  commentCount={article.comment_count}
                  cover={article.cover_url!}
                  createAt={article.created_at}
                  creator={{ name: article.creator_name, avatar: article.creator_avatar }}
                  description={article.description!}
                  extra={
                    editable ? (
                      <Flexbox
                        align="center"
                        horizontal
                        justify="flex-end"
                        paddingInline={'0.5rem'}
                        width="100%"
                        gap="0.5rem"
                      >
                        {article.status === 'draft' && (
                          <Link href={'#'} onClick={() => onPublish(article.id!)}>
                            发布
                          </Link>
                        )}
                        {article.status === 'published' && (
                          <Link href={'#'} onClick={() => onUnpublish(article.id!)}>
                            取消发布
                          </Link>
                        )}
                        <Link href={`/agora/article/edit?id=${article.id}`}>编辑</Link>
                      </Flexbox>
                    ) : undefined
                  }
                  id={article.id!}
                  key={article.id}
                  likeCount={article.like_count}
                  title={article.title}
                  viewCount={article.view_count}
                />
              </Link>
            ))}
          </Grid>
          {data?.contents.length ? (
            <Pagination currentPage={data.page} pageSize={12} total={data?.total || 0} />
          ) : null}
        </Container>
      </PageContainer>
    </Flexbox>
  );
});

export default ArticleList;
