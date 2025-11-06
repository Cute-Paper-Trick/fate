import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { StateCreator } from 'zustand';

import { V1TaskListReq, V1TaskListRes, taskService } from '@/lib/http';

export interface TemplateAction {
  useFetchTemplate: (params: V1TaskListReq) => UseQueryResult<V1TaskListRes>;
}

export const createTemplateSlice: StateCreator<
  TemplateAction,
  [['zustand/devtools', never]],
  [],
  TemplateAction
> = () => ({
  useFetchTemplate: (params) => {
    return useQuery({
      queryKey: ['template', params],
      queryFn: async () => taskService().taskList(),
    });
  },
});
