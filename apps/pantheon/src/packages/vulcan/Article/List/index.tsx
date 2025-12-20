import { Grid } from '@lobehub/ui';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useContentsList } from '@/lib/http';

import Container from '../../Container';
import ContentEmpty from '../../Empty';
import ListLoading from '../../ListLoading';
import PageContainer from '../../PageContainer';
import Pagination from '../../Pagination';
import ArticleCard from '../Card';
import { ContentStatus } from '../types';

interface ArticleListProps {
  status?: ContentStatus;
}

const ArticleList = memo<ArticleListProps>(({ status }) => {
  const [page] = useQueryState('page', { ...parseAsInteger, defaultValue: 1 });
  const [collectionId] = useQueryState('collectionId', parseAsInteger);

  const { data, isPending } = useContentsList({
    page: page,
    size: 12,
    collection_id: collectionId || undefined,
    status,
  });

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
          {data?.contents.length ? (
            <>
              <Grid maxItemWidth={'320px'} rows={4} width={'100%'}>
                {data.contents.map((article) => (
                  <ArticleCard
                    commentCount={article.comment_count}
                    cover={article.cover_url!}
                    createAt={article.created_at}
                    creator={{ name: article.creator_name, avatar: article.creator_avatar }}
                    description={article.description!}
                    id={article.id!}
                    key={article.id}
                    likeCount={article.like_count}
                    title={article.title}
                    viewCount={article.view_count}
                  />
                ))}
              </Grid>
              <Pagination currentPage={data.page} pageSize={12} total={data?.total || 0} />
            </>
          ) : (
            <ContentEmpty />
          )}
        </Container>
      </PageContainer>
    </Flexbox>
  );
});

export default ArticleList;
