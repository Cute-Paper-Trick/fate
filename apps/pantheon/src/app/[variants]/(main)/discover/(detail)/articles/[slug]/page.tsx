'use client';

import { useParams } from 'next/navigation';
import { memo } from 'react';

import ArticleDetail from '@/packages/vulcan/Article/Detail';

const DiscoverArticleDetail = memo(() => {
  const { slug } = useParams();

  return <ArticleDetail id={Number(slug)} />;
});

export default DiscoverArticleDetail;
