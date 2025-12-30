'use client';

import { Grid } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import Link from 'next/link';
import { memo, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSession } from '@/features/cerberus/client';
import { useCollectionsList } from '@/lib/http';

import Container from '../../Container';
import ContentEmpty from '../../Empty';
import ListLoading from '../../ListLoading';
import PageContainer from '../../PageContainer';
import Section from '../../Section';
import CollectionCard from '../Card';
import CollectionModal, { CollectionModalRef } from './CollectionModal';

const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  `,
}));

const CollectionList = memo(() => {
  const { styles } = useStyles();

  const { data: sessionData } = useSession();
  const editable = sessionData?.user.role === 'creator';

  const { data, isPending } = useCollectionsList({ page: 1, size: 999_999 });

  const modal = useRef<CollectionModalRef>(null);

  if (isPending) {
    return (
      <PageContainer>
        <Container>
          <Section title="专题">
            <ListLoading />
          </Section>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CollectionModal ref={modal} />
      <Container className={styles.container}>
        <Section title="专题">
          <Grid gap={'1.25rem'} maxItemWidth={'170px'} rows={6} width={'100%'}>
            {editable && (
              <CollectionCard
                cover="https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/new-collection-cover.png?x-process=image/resize,m_lfit,w_524/quality,q_90/format,webp"
                description="创建并管理你的专题合集"
                onClick={() => modal.current?.open()}
                title="创建新专题"
              />
            )}
            {data?.collections?.map((item) => (
              <Link
                href={`/discover/collections/detail?collectionId=${item.id}`}
                key={item.id}
                style={{ color: 'unset' }}
              >
                <CollectionCard
                  cover={item.cover_url}
                  description={item.description}
                  extra={
                    editable ? (
                      <Flexbox horizontal justify="flex-end" padding={'0.5rem'} width="100%">
                        <Link href="#" onClick={() => modal.current?.open(item.id)}>
                          编辑
                        </Link>
                      </Flexbox>
                    ) : null
                  }
                  id={item.id}
                  key={item.id}
                  title={item.name}
                />
              </Link>
            ))}
          </Grid>
        </Section>
        {!editable && data?.collections.length === 0 && <ContentEmpty />}
      </Container>
    </PageContainer>
  );
});

export default CollectionList;
