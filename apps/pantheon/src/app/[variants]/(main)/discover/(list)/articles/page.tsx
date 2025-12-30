'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSession } from '@/features/cerberus/client';
import ArticleList from '@/packages/vulcan/Article/List';

const DiscoverArticles = memo(() => {
  const { data: sessionData } = useSession();

  const status = sessionData?.user.role === 'creator' ? undefined : 'published';

  return (
    <Flexbox className="discover-articles" height={'100%'} width={'100%'}>
      <ArticleList status={status} />
    </Flexbox>
  );
});

export default DiscoverArticles;
