'use client';

import { Grid } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import { useCollectionsList } from '@/lib/http';

import Container from '../../Container';
import ContentEmpty from '../../Empty';
import ListLoading from '../../ListLoading';
import PageContainer from '../../PageContainer';
import Section from '../../Section';
import CollectionCard from '../Card';

const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  `,
}));

const CollectionList = memo(() => {
  const { styles } = useStyles();

  const { data, isPending } = useCollectionsList({ page: 1, size: 999_999 });

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
      <Container className={styles.container}>
        <Section title="专题">
          <Grid gap={'1.25rem'} maxItemWidth={'200px'} rows={6} width={'100%'}>
            {data?.collections?.map((item) => (
              <CollectionCard cover={item.cover_url} id={item.id} key={item.id} />
            ))}
          </Grid>
        </Section>
        {data?.collections.length === 0 && <ContentEmpty />}
      </Container>
    </PageContainer>
  );
});

export default CollectionList;
