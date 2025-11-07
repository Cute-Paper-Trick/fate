import { useTranslate } from '@tolgee/react';

import { TaskButtonConfig, V1TaskUserInfo } from './initialState';

/**
 * @title 判断任务是否为核心任务（前置任务已完成）
 */
export const isCoreTask = (item: V1TaskUserInfo, listData: V1TaskUserInfo[] | null) => {
  if (item.parent_index !== '') {
    const numArr = new Set(item.parent_index.split(',').map(Number));
    const arr = listData?.filter((item) => numArr.has(item.index)) || [];
    return arr.every((item) => item.status === 'done');
  }
  return true;
};
/**
 * @title 判断任务是否为完成任务
 */
export const isCompleteTask = (item: V1TaskUserInfo) => {
  return item.status === 'done';
};

/**
 * @title 判断任务状态
 */
export const isStatusTask = (item: V1TaskUserInfo) => {
  if (item.parent_index !== '') {
    return 'lock';
  }
  return item.status === 'done' ? 'challenge' : 'complete';
};

/**
 * @title 判断任务是否被锁定
 */
export const isTaskLocked = (item: V1TaskUserInfo, listDict: Record<number, V1TaskUserInfo>) => {
  if (item.parent_index === '') {
    return false;
  }

  for (const parentIndex of item.parent_index.split(',')) {
    const parentTask = listDict[Number(parentIndex)];
    if (!parentTask || parentTask.status !== 'done') {
      return true;
    }
  }
  return false;
};

/**
 * @title 获取任务按钮状态
 */
export const useTaskButtons = () => {
  const { t } = useTranslate('learning');

  const getTaskButtons = (
    item: V1TaskUserInfo,
    listDict: Record<number, V1TaskUserInfo>,
  ): TaskButtonConfig[] => {
    if (item.status === 'done') {
      return [{ type: 'text', text: t('已完成'), disabled: true, color: '#22c55e' }];
    }

    if (isTaskLocked(item, listDict)) {
      return [{ type: 'text', text: t('未解锁'), disabled: true, color: '#6b7280' }];
    }

    return [
      { type: 'default', text: t('去挑战'), action: 'challenge', color: '#4f46e5' },
      {
        type: 'primary',
        text: t('去完成'),
        action: 'complete',
        color: '#4f46e5',
        taskIndex: { task_index: item.index },
      },
    ];
  };

  return { getTaskButtons };
};
