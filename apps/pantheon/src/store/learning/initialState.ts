import { UseQueryResult } from '@tanstack/react-query';

import { V1TaskListReq, V1TaskListRes } from '@/lib/http';

/**
 * @title slices切片的类型定义
 * @description 下面俩个为slices切片的类型定义
 */

export interface V1TaskUserInfo {
  id: number;
  index: number;
  parent_index: string;
  title: string;
  jump: string;
  category: string;
  description: string;
  material: string;
  status: string;
}
export interface TaskListState {
  taskList: V1TaskUserInfo[] | null;
  listDict: Record<number, V1TaskUserInfo>;
}
export interface TaskButtonGroupProps {
  item: V1TaskUserInfo;
}

export interface TaskListActions {
  useFetchTaskList: (params: V1TaskListReq) => UseQueryResult<V1TaskListRes>;
  completeTask: (taskIndex: V1TaskUserDoneReq) => Promise<void>;
}

export type V1TaskUserDoneReq = {
  /**
   * @type integer, int
   */
  task_index: number;
};

/**
 * @title 此为store中使用的初始状态定义
 */
export const initialTaskListState: TaskListState = {
  taskList: null,
  listDict: {},
};

/**
 * @title 此为selectors模块中使用的btn类型定义
 */
export interface TaskButtonConfig {
  type: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  text: string;
  color?: string;
  disabled?: boolean;
  action?: 'complete' | 'challenge';
  taskIndex?: V1TaskUserDoneReq;
  onClick?: (task: V1TaskUserInfo) => void;
}
