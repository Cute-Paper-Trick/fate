import { Avatar } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { RemoteWrapper } from '@/packages/pithos';
import { formatRelativeTime } from '@/packages/utils';

const useStyles = createStyles(({ css }) => ({
  meta: css`
    font-size: 0.825rem;
  `,
  name: css`
    color: #5a5a5a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 110px;
  `,
  createdAt: css`
    color: #8e8e93;
    font-size: 0.8em;
  `,
}));

interface CreatorMetaProps {
  creatorName?: string;
  creatorAvatar?: string;
  createdAt?: string;
}

const CreatorMeta = memo<CreatorMetaProps>(({ creatorName, creatorAvatar, createdAt }) => {
  const { styles } = useStyles();

  return (
    <Flexbox align="center" gap={6} horizontal justify="start">
      <RemoteWrapper path={creatorAvatar ? `lobe-goood-space/${creatorAvatar}` : ''}>
        {(realSrc) => <Avatar size={36} src={realSrc} />}
      </RemoteWrapper>
      <Flexbox align="start">
        <span className={styles.name}>{creatorName}</span>
        <span className={styles.createdAt}>{formatRelativeTime(createdAt ?? '')}</span>
      </Flexbox>
    </Flexbox>
  );
});

export default CreatorMeta;
