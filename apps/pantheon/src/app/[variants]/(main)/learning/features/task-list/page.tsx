'use client';

import { CheckCircleFilled, LockFilled, TrophyFilled } from '@ant-design/icons';
import { List } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';

import { isCompleteTask, isCoreTask, isStatusTask } from '@/store/learning/helpers';
import { useLearningStore } from '@/store/learning/store';

import { TaskButtonGroup } from '../task-button/page';
import styles from './index.module.css';

const TaskList: FC = () => {
  const useFetchTaskList = useLearningStore((s) => s.useFetchTaskList);
  const { data: taskList } = useFetchTaskList({});
  return (
    <div className={styles.taskList}>
      <List
        dataSource={taskList?.list || []}
        itemLayout="horizontal"
        loading={!taskList}
        pagination={{ position: 'bottom', align: 'end' }}
        renderItem={(item) => (
          <List.Item
            actions={[<TaskButtonGroup item={item} key="button-group" />]}
            className={clsx(
              styles.listItem,
              !isCoreTask(item, taskList?.list || null) && styles.disabled,
              !isCoreTask(item, taskList?.list || null) && styles.taskOpacity4,
              isCompleteTask(item) && styles.taskOpacity6,
            )}
          >
            <List.Item.Meta
              avatar={
                <div
                  className={clsx(
                    styles.avatarContainer,
                    isStatusTask(item) === 'complete'
                      ? styles.complete
                      : isStatusTask(item) === 'lock'
                        ? styles.lock
                        : styles.publish,
                  )}
                >
                  {isStatusTask(item) === 'complete' ? (
                    <CheckCircleFilled className={styles.avatar} />
                  ) : isStatusTask(item) === 'lock' ? (
                    <LockFilled className={styles.avatar} />
                  ) : (
                    <TrophyFilled className={styles.avatar} />
                  )}
                  <div
                    className={clsx(!isCoreTask(item, taskList?.list || null) && styles.cover)}
                  />
                </div>
              }
              description={item.description || ''}
              title={
                <div
                  className={clsx(
                    styles.taskTitle,
                    isCompleteTask(item) ? styles.taskLineTitle : '',
                  )}
                >
                  {item.title}
                </div>
              }
            />
          </List.Item>
        )}
        size="large"
      />
    </div>
  );
};

export default TaskList;
