'use client';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from 'antd';

import { accountService } from '@/lib/http';

import { TopicCreate } from './topic-create';
import styles from './topic-create.module.scss';

// import styles from "./topic-create.module.less";

interface TopicCreateInnerProps {
  open: boolean;
  onCreated: () => void;
}

export function TopicCreateInner({ onCreated }: TopicCreateInnerProps) {
  const { data: avatar } = useQuery({
    queryKey: [],
    queryFn: () => accountService().accountProfile(),
    enabled: true,
  });

  return (
    <div className={styles.create_box}>
      <Avatar className={styles.avatar} size={42} src={avatar?.avatar || undefined}>
        {avatar?.account?.slice(0, 1)?.toUpperCase()}
      </Avatar>
      <TopicCreate onCreated={onCreated} />
    </div>
  );
}
