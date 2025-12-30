'use client';

import { Divider, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo, useEffect, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import { NotionEditor } from '@/components/tiptap-templates/notion-like/notion-like-editor';
import { useContentsDetail, useContentsView } from '@/lib/http';

import ArticleHeader from '../Header';
import Replies from '../Replies';
import ReplyArticle from '../Reply';

const useStyles = createStyles(({ css }) => ({
  container: css`
    overflow-y: scroll;
  `,
  layout: css`
    // overflow: auto;
    width: 100%;
    max-width: 1380px;
    transform: translateX(20px);
    margin: 0 auto;
    padding: 1rem;
    gap: 1rem;
    display: grid;
    grid-template-columns: 4rem 7fr 3fr;

    font-size: 1rem;
  `,
  sideLeft: css`
    width: 4rem;
    display: block;
    grid-row-end: initial;
  `,
  sideRight: css`
    width: 3fr;
  `,
  mainContent: css`
    scroll-margin-top: 56px;
  `,
  articleWrapper: css`
    border-radius: Max(0px, Min(0.375rem, calc((100vw - 4px - 100%) * 9999))) / 0.375rem;
    background: rgb(255, 255, 255);
    color: rgb(23, 23, 23);
    box-shadow: 0 0 0 1px rgba(23, 23, 23, 0.133);
    overflow-wrap: anywhere;
    overflow: hidden;
    min-width: 0;
  `,
  article: css`
    min-width: 0;
  `,
  main: css`
    .notion-like-editor-content .tiptap.ProseMirror.notion-like-editor {
      padding-bottom: 3rem;
    }
  `,
  comments: css``,
}));

const ArticleDetail = memo(() => {
  const { styles } = useStyles();
  const [id] = useQueryState('id', parseAsInteger);
  const { data, isLoading } = useContentsDetail({ id: id! }, { query: { enabled: !!id } });

  const hasViewed = useRef(false);
  const { mutate } = useContentsView();

  useEffect(() => {
    console.log('id', id);
    if (id && !hasViewed.current) {
      mutate({ data: { id } });
      hasViewed.current = true;
    }
  }, [id]);

  if (!data || isLoading) {
    return <Skeleton />;
  }

  return (
    <Flexbox className={styles.container} height={'100%'} width={'100%'}>
      <section className={styles.layout}>
        <aside className={styles.sideLeft} />
        <main className={styles.mainContent}>
          <div className={styles.articleWrapper}>
            <article className={styles.article}>
              <div className={styles.main}>
                <ArticleHeader
                  authorAvatar={data.content.creator_avatar ?? ''}
                  authorName={data.content.creator_name ?? ''}
                  coverUrl={data.content.cover_url ?? ''}
                  createdAt={data.content.created_at ?? ''}
                  title={data.content.title ?? ''}
                />
                <NotionEditor content={data.content.body} editable={false} />
              </div>

              <Divider />

              <section className={styles.comments}>
                <Flexbox paddingBlock={'1rem'} paddingInline={'2rem'} width={'100%'}>
                  <ReplyArticle />
                </Flexbox>

                <Replies />
              </section>
            </article>
          </div>
        </main>
        <aside className={styles.sideRight} />
      </section>
    </Flexbox>
  );
});

ArticleDetail.displayName = 'ArticleDetail';

export default ArticleDetail;
