import { Avatar } from '@lobehub/ui';
import clsx from 'clsx';
import { DateTime } from 'luxon';

import styles from './topic-info.module.scss';

interface TopicDetailProps {
  topic: {
    avatar?: string;
    account?: string;
    created_at: string;
    id?: string | number;
  };
}

export function TopicInfo({ topic }: TopicDetailProps) {
  return (
    <div className={styles.topic_info}>
      <Avatar
        size={40}
        src={topic.avatar || null}
        style={{ minWidth: '42px', backgroundColor: '#bbb' }}
      >
        {topic.account}
      </Avatar>
      <div className={clsx(styles.talk_author)}>
        <span className="flex felx-col">
          <div className={styles.avatarText}>
            <div className={styles.name}>{topic.account}</div>
            <div className={styles.avatar_sub}>
              {DateTime.fromISO(topic.created_at, { zone: 'utc' })
                .setZone('Asia/Shanghai')
                .toFormat('DD')}
            </div>
          </div>
        </span>
        <div style={{ color: '#b2b2b2', fontSize: '12px' }}>#{topic.id}</div>
      </div>
    </div>
  );
}
