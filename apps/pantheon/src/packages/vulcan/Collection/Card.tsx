import { createStyles, cx } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { RemoteWrapper } from '@/packages/pithos';

const useStyles = createStyles(({ css }) => ({
  card: css`
    position: relative;
    cursor: pointer;
    background-color: #fff;

    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.06);

    .meta {
      display: none;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.8);
      bottom: 0;
      left: 0;
      right: 0;
    }

    &:hover {
      .meta {
        display: block;
      }
    }
  `,
  id: css`
    position: absolute;
    top: 0.125rem;
    right: 0.125rem;
    z-index: 1;
    font-weight: 600;
    font-size: 0.875rem;

    color: #c7c7cc;

    opacity: 0.4;
  `,
  coverWrapper: css`
    position: relative;
    width: 100%;
    overflow: hidden;
  `,
  cover: css`
    width: 100%;
    aspect-ratio: 3 / 4;
    background-color: #5a5a5a;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    &:hover {
      // opacity: 0.85;
    }
  `,
  meta: css`
    padding: 0.75rem 0.875rem 1rem 0.875rem;
  `,
  title: css`
    font-weight: 600;
    font-size: 1rem;
  `,
  description: css`
    font-size: 0.875rem;
    line-height: 1.5;
    color: #6b6b73;
    padding-block: 0.25rem;
    min-height: calc(0.875rem * 1.5 * 2);

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
}));

interface CollectionCardProps {
  id?: number;
  title?: string;
  description?: string;
  cover: string;
  onClick?: () => void;
  extra?: React.ReactNode;
}

const CollectionCard = memo<CollectionCardProps>(
  ({ id, title, description, cover, onClick, extra }) => {
    const { styles } = useStyles();

    return (
      <Flexbox className={styles.card} onClick={onClick}>
        <span className={styles.id}>{id}</span>
        <div className={styles.coverWrapper}>
          <RemoteWrapper
            path={cover}
            process={['image', 'resize,limit_1,m_lfit,w_524', 'quality,q_90', 'format,webp']}
          >
            {(realSrc) => (
              <div className={styles.cover} style={{ backgroundImage: `url(${realSrc})` }} />
              // <Image alt={title} className={styles.cover} preview={false} src={realSrc} />
            )}
          </RemoteWrapper>
        </div>
        <Flexbox className="meta" width="100%">
          <Flexbox className={cx(styles.meta)}>
            <span className={styles.title}>{title}</span>
            <span className={styles.description}>{description}</span>
          </Flexbox>
          {extra}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default CollectionCard;
