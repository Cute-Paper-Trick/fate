'use client';

import { useTranslate } from '@tolgee/react';
import React, { FC } from 'react';

import styles from './index.module.css';

const TaskBreadcrumb: FC = () => {
  const { t } = useTranslate('learning');
  return (
    <div className={styles.taskListTitle}>
      <div className={styles.title}>{t('新手引导任务')}</div>
      <div className={styles.des}>
        <p>{t('完成以下任务，你将可以获得积分奖励，并解锁更多高级功能。快来挑战吧！')}</p>
      </div>
    </div>
  );
};
export default TaskBreadcrumb;
