import { createStyles } from 'antd-style';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useS3 } from '@/packages/s3';

const useStyles = createStyles(({ css }) => ({
  card: css`
    position: relative;
    cursor: pointer;
    background-color: #fff;

    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.06);
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
  cover: css`
    width: 100%;
    height: 100%;

    &:hover {
      opacity: 0.85;
    }
  `,
}));

interface CollectionCardProps {
  id?: number;
  title?: string;
  cover: string;
}

const CollectionCard = memo<CollectionCardProps>(({ id, title, cover }) => {
  const { styles } = useStyles();
  const { signature } = useS3();

  const coverUrl = signature(cover, [
    'image',
    'resize,limit_1,m_lfit,w_262',
    'quality,q_90',
    'format,webp',
  ]);

  return (
    <Flexbox className={styles.card}>
      <span className={styles.id}>{id}</span>
      <Link className={styles.cover} href={`/discover/collections/detail?collectionId=${id}`}>
        <img src={coverUrl} alt={title} />
      </Link>
    </Flexbox>
  );
});

export default CollectionCard;
