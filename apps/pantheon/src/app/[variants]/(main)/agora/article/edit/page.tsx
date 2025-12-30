'use client';

import { memo } from 'react';

import ArticleEditor from '@/packages/agora/Article/Edit';

const ArticleEditorPage = memo(() => {
  return <ArticleEditor />;
});

ArticleEditorPage.displayName = 'ArticleEditorPage';

export default ArticleEditorPage;
