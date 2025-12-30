import { Avatar } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { formatRelativeTime } from '@/packages/utils';

import ReactionsEngagement from '../Reaction/Engagement';
import ArticleTag from '../Tag';
import ArticleTitle from './Title';

const useStyles = createStyles(({ css }) => ({
  meta: css`
    padding: 2rem 2rem;
    padding-bottom: 0;
  `,
  content: css`
    padding-left: 0.75rem;
  `,
  author: css`
    font-weight: 700;
  `,
  createdAt: css`
    font-size: 0.75rem;
    color: #717171;
  `,
  title: css`
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  `,
}));

interface ArticleMetaProps {
  tags?: { name: string; color: string }[];
  title: string;
  createdAt: string;
  reactions?: Record<string, number>;
  authorName: string;
  authorAvatar?: string;
}

const ArticleMeta = memo<ArticleMetaProps>(
  ({ tags = [], title, createdAt, authorName, authorAvatar, reactions = {} }) => {
    const { styles } = useStyles();

    return (
      <div className={styles.meta}>
        <Flexbox horizontal style={{ marginBottom: '1.25rem' }} width="100%">
          <Avatar size={40} src={authorAvatar} />
          <Flexbox className={styles.content}>
            <span className={styles.author}>{authorName}</span>
            <time className={styles.createdAt} dateTime={createdAt}>
              发布于 {formatRelativeTime(createdAt)}
            </time>
          </Flexbox>
        </Flexbox>

        <ReactionsEngagement engagement={reactions} />

        <ArticleTitle>{title}</ArticleTitle>

        <Flexbox gap={'.125rem'} horizontal>
          {tags.map((tag) => (
            <ArticleTag color={tag.color} key={tag.name} name={tag.name} />
          ))}
        </Flexbox>
      </div>
    );
  },
);

ArticleMeta.displayName = 'ArticleMeta';

export default ArticleMeta;
