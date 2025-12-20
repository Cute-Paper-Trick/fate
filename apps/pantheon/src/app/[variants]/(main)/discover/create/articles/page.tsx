'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ArticleDraft } from '@/packages/vulcan';

const CreateArticle = memo(() => {
  return (
    <Flexbox height={'100%'} style={{ backgroundColor: '#f7f7f8' }} width={'100%'}>
      <ArticleDraft />
    </Flexbox>
  );
});

export default CreateArticle;
