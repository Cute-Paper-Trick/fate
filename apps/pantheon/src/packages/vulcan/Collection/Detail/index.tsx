'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSession } from '@/features/cerberus/client';
import { useCollectionsDetail } from '@/lib/http';

import ArticleList from '../../Article/List';
import Container from '../../Container';
import { DetailsLoading } from '../../ListLoading';
import PageContainer from '../../PageContainer';
import Section from '../../Section';
import Header from './Header';

const CollectionDetail = memo(() => {
  const { data: sessionData } = useSession();
  const editable = sessionData?.user.role === 'creator';

  const [collectionId] = useQueryState('collectionId', parseAsInteger);

  const { data, isPending } = useCollectionsDetail(
    { id: collectionId as any as number },
    { query: { enabled: !!collectionId } },
  );

  const title = data?.collection?.name;

  if (isPending) {
    return <DetailsLoading />;
  }
  return (
    <Flexbox>
      <Header />
      <PageContainer>
        <Container>
          <Section title={title}>
            <ArticleList status={editable ? undefined : 'published'} />
          </Section>
        </Container>
      </PageContainer>
    </Flexbox>
  );
});

export default CollectionDetail;
