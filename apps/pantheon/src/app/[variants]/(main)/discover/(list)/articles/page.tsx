'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ArticleList from '@/packages/vulcan/Article/List';
import { ContentStatus } from '@/packages/vulcan/Article/types';

const DiscoverArticles = memo(() => {
  return (
    <Flexbox className="discover-articles" height={'100%'} width={'100%'}>
      <ArticleList status={ContentStatus.PUBLISHED} />
    </Flexbox>
  );
});

export default DiscoverArticles;
