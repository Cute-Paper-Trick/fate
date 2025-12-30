import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { RemoteImage } from '@/packages/pithos';

import { ReactionCate } from '../type';
import AuthMeta from './Meta';

const useStyles = createStyles(({ css }) => ({
  header: css`
    overflow-wrap: anywhere;
    word-break: break-word;
  `,
  cover: css`
    aspect-ratio: auto 1000 / 420;
    display: block;
    margin: auto;
    object-fit: contain;
    border-radius: var(--radius-auto) var(--radius-auto) 0 0;
    max-height: calc(77vh - var(--header-height));
  `,
}));

interface ArticleHeaderProps {
  title: string;
  coverUrl: string;
  authorName: string;
  authorAvatar?: string;
  reactions?: Partial<Record<ReactionCate, number>>;
  createdAt: string;
  tags?: { name: string; color: string }[];
}

const ArticleHeader = memo<ArticleHeaderProps>(
  ({ title, coverUrl, authorName, authorAvatar, reactions, createdAt, tags = [] }) => {
    const { styles } = useStyles();

    // const coverWidth = 1000;
    // const coverHeight = 420;

    return (
      <header className={styles.header}>
        <Flexbox justify="center" width={'100%'}>
          <RemoteImage
            alt={title}
            className={styles.cover}
            preview
            process={['image', 'resize,limit_1,m_lfit,w_1000,h_420', 'quality,q_90', 'format,webp']}
            src={coverUrl}
            // style={{ aspectRatio: `auto ${coverWidth} / ${coverHeight}` }}
          />
        </Flexbox>
        <AuthMeta
          authorAvatar={authorAvatar}
          authorName={authorName}
          createdAt={createdAt}
          reactions={reactions}
          tags={tags}
          title={title}
        />
      </header>
    );
  },
);

ArticleHeader.displayName = 'ArticleHeader';

export default ArticleHeader;
