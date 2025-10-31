'use client';

import { Button, FluentEmoji } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { MAX_WIDTH } from '@/const/layoutTokens';

const NotFound = memo(() => {
  const { t } = useTranslate('error');
  return (
    <Flexbox align={'center'} justify={'center'} style={{ minHeight: '100%', width: '100%' }}>
      <h1
        style={{
          filter: 'blur(8px)',
          fontSize: `min(${MAX_WIDTH / 3}px, 50vw)`,
          fontWeight: 'bolder',
          margin: 0,
          opacity: 0.12,
          position: 'absolute',
          zIndex: 0,
        }}
      >
        404
      </h1>
      <FluentEmoji emoji={'👀'} size={64} />
      <h2 style={{ fontWeight: 'bold', marginTop: '1em', textAlign: 'center' }}>
        {t('notFound.title')}
      </h2>
      <div style={{ lineHeight: '1.8', marginBottom: '2em' }}>
        <p style={{ margin: 0 }}>{t('notFound.desc')}</p>
        <p style={{ marginTop: '0.5em', textAlign: 'center' }}>{t('notFound.check')}</p>
      </div>
      <Link href="/">
        <Button type={'primary'}>{t('notFound.backHome')}</Button>
      </Link>
    </Flexbox>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;
