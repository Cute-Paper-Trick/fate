'use client';

import { TopicCreate } from './topic-create';
import styles from './topic-create.module.scss';

// import styles from "./topic-create.module.less";

interface TopicCreateInnerProps {
  open: boolean;
  onCreated: () => void;
}

export function TopicCreateInner({ onCreated }: TopicCreateInnerProps) {
  return (
    <div className={styles.create_box}>
      <TopicCreate onChange={onCreated} />
    </div>
  );
}
