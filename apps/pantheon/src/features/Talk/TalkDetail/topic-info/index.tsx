import { Avatar } from '@lobehub/ui';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { usePathname } from 'next/navigation';
import { Flexbox } from 'react-layout-kit';

import { modal } from '@/components/AntdStaticMethods';
import { useTaskTopicDelete } from '@/lib/http';
import { queryClient } from '@/lib/query';

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
  const pathname = usePathname();
  const { mutateAsync } = useTaskTopicDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['topic', 'list'] });
      },
    },
  });

  const onDelete = () => {
    modal.confirm({
      title: '确认删除该话题吗？',
      onOk: async () => {
        await mutateAsync({ data: { id: Number(topic.id) } });
      },
    });
  };

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
        <Flexbox gap={8} horizontal style={{ color: '#b2b2b2', fontSize: '12px' }}>
          {pathname === '/talk/mine' && <Trash2 color={'red'} onClick={onDelete} size={14} />}#
          {topic.id}
        </Flexbox>
      </div>
    </div>
  );
}
