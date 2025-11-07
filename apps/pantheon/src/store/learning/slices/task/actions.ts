import { useQuery } from '@tanstack/react-query';
import { StateCreator } from 'zustand';

import { taskUserService } from '@/lib/http';
import { queryClient } from '@/lib/query';

import { TaskListActions, TaskListState, V1TaskUserDoneReq } from '../../initialState';

// import type { StateCreator } from 'zustand/vanilla';

export const createTaskSlice: StateCreator<
  TaskListState & TaskListActions,
  [['zustand/devtools', never]],
  [],
  TaskListActions
> = () => ({
  useFetchTaskList: (params) => {
    return useQuery({
      queryKey: ['tasks', params],
      queryFn: async () => taskUserService().taskUserList(params),
    });
  },

  /**
   * @title 发布并完成任务并刷新tasks（弹框内）
   */
  completeTask: async (taskIndex: V1TaskUserDoneReq) => {
    try {
      await taskUserService().taskUserDone(taskIndex);
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  },
});
