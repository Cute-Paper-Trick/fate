import { useQuery } from '@tanstack/react-query';
import { StateCreator } from 'zustand';

import { NotificationListQueryParams, notificationService, taskTopicService } from '@/lib/http';

import { MessageListActions, MessageListState } from '../initialState';

export const createTaskSlice: StateCreator<
  MessageListState & MessageListActions,
  [['zustand/devtools', never]],
  [],
  MessageListActions
> = () => ({
  useFetchMessageList: (params) => {
    return useQuery({
      queryKey: ['topic', 'list', 'all', params],
      queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
        const typedPageParam = pageParam as { page: number; size: number } | undefined;
        return notificationService().notificationList({
          ...params,
          page: typedPageParam?.page || params?.page || 1,
          size: typedPageParam?.size || params?.size || 20,
        } as NotificationListQueryParams);
      },
    });
  },

  /**
   * @title 详情
   */
  useGetTopicDetail: (params) => {
    return useQuery({
      queryKey: ['topicDetail', params],
      queryFn: async () => {
        return taskTopicService().taskTopicDetail(params);
      },
      enabled: !!params.id,
    });
  },
});
