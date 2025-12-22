import { createStyles } from 'antd-style';
import { Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { formatNumber } from '@/packages/utils';

import { useCoverUrl } from '../Header/useCoverUrl';
import CreatorMeta from './CreatorMeta';

const useStyles = createStyles(({ css }) => ({
  card: css`
    cursor: pointer;

    background: #fff;
    border-radius: 4px;
    margin-bottom: 17px;
    overflow: hidden;
    width: 100%;
    position: relative;
  `,
  coverArea: css`
    background-color: #f6f6f6;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    color: #fff;
    display: block;
    padding-bottom: 46.8518518519%;
    position: relative;
  `,
  cover: css`
    background: rgba(0, 0, 0, 0.8);
    opacity: 0.075;
    padding: 1.4285714286em;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    &:hover {
      opacity: 0.85;
      span {
        visibility: visible;
      }
    }
  `,
  inner: css`
    padding: 1.0625rem;
  `,
  category: css`
    color: #ff3d1d;
    height: 1.4em;
    line-height: 1.4em;
    max-height: none;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  desc: css`
    font-size: 0.875rem;
    height: auto;
    line-height: 1.4em;
    margin: 0;
    max-height: 4.2em;
    overflow: hidden;
    text-overflow: ellipsis;
    visibility: hidden;
  `,
  title: css`
    height: 2.8em;
    line-height: 1.4em;
    max-height: none;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.875rem;
    margin-top: 0.7142857143em;
    font-weight: 600;

    color: #323232;
  `,
  footer: css`
    margin-top: 2.125rem;
  `,
  action: css`
    color: #8e8e93;
    font-size: 12px;
  `,
}));

interface ArticleCardProps {
  id: number;
  cover?: string;
  title?: string;
  description?: string;
  creator?: {
    name?: string;
    avatar?: string;
  };
  createAt?: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;
}

const ArticleCard = memo<ArticleCardProps>(
  ({ id, cover, title, description, creator, createAt, viewCount, likeCount, commentCount }) => {
    const { styles, cx } = useStyles();

    const coverPath = useCoverUrl(cover, ['image', 'resize,limit_1,m_lfit,w_313', 'quality,q_90']);

    return (
      <Link href={`/discover/articles/${id}`}>
        <Flexbox className={cx(styles.card, 'card')}>
          <div className={styles.coverArea} style={{ backgroundImage: `url(${coverPath})` }}>
            <Center className={cx(styles.cover, 'cover')}>
              <span className={styles.desc}>{description}</span>
            </Center>
          </div>
          <Flexbox className={styles.inner}>
            <div className={styles.category}>{/* <span>官方活动</span> */}</div>
            <span className={styles.title}>{title}</span>
            <Flexbox align="center" className={styles.footer} horizontal justify="space-between">
              <CreatorMeta
                createdAt={createAt}
                creatorAvatar={creator?.avatar}
                creatorName={creator?.name}
              />
              <Flexbox gap={10} horizontal>
                <Flexbox className={styles.action} gap={2} horizontal>
                  <ThumbsUp color="#8e8e93" size={16} strokeWidth={1} /> {formatNumber(likeCount)}
                </Flexbox>
                <Flexbox className={styles.action} gap={2} horizontal>
                  <MessageCircle color="#8e8e93" size={16} strokeWidth={1} />{' '}
                  {formatNumber(commentCount)}
                </Flexbox>
                <Flexbox className={styles.action} gap={2} horizontal>
                  <Eye color="#8e8e93" size={16} strokeWidth={1} /> {formatNumber(viewCount)}
                </Flexbox>
              </Flexbox>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Link>
    );
  },
);

export default ArticleCard;
