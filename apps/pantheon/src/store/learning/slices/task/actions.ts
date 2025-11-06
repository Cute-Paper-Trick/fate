import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { StateCreator } from 'zustand';

import { V1TaskListReq, V1TaskListRes, taskService } from '@/lib/http';

// import type { StateCreator } from 'zustand/vanilla';

export interface TaskAction {
  useFetchTaskList: (params: V1TaskListReq) => UseQueryResult<V1TaskListRes>;
}

export const createTaskSlice: StateCreator<
  TaskAction,
  [['zustand/devtools', never]],
  [],
  TaskAction
> = () => ({
  useFetchTaskList: (params) => {
    return useQuery({
      queryKey: ['tasks', params],
      queryFn: async () => taskService().taskList(params),
    });
  },
});
