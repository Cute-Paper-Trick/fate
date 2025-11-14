import {
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { StateCreator } from 'zustand';

import { getNextPageParam } from '@/features/Talk/TalkDetail/components/useInfiniteList';
import {
  V1AccountProfileRes,
  V1TaskTopicInfo,
  V1TopicInfo,
  accountService,
  taskTopicService,
} from '@/lib/http';

export interface TopicAction {
  useTopicList: () => {
    topicListQuery: UseInfiniteQueryResult<V1TaskTopicInfo[], Error>;
    hasNextPage: boolean;
    isFetching: boolean;
    fetchNextPage: UseInfiniteQueryResult['fetchNextPage'];
  };
  useTopicMineList: () => {
    topicListQuery: UseInfiniteQueryResult<V1TopicInfo[], Error>;
    hasNextPage: boolean;
    isFetching: boolean;
    fetchNextPage: UseInfiniteQueryResult['fetchNextPage'];
  };

  useProfile: () => UseQueryResult<V1AccountProfileRes, Error>;
}

export const createTopicSlice: StateCreator<
  TopicAction,
  [['zustand/devtools', never]],
  []
> = () => ({
  useTopicList: () => {
    const queryKey = ['topic', 'list'];
    const topicListQuery = useInfiniteQuery({
      queryKey: queryKey,
      queryFn: async ({ pageParam }) => taskTopicService().taskTopicList(pageParam),
      initialPageParam: { page: 1, size: 20 },
      getNextPageParam: getNextPageParam,
      select: (data) => {
        const allTopics = data.pages.flatMap((d) => d.list);

        return allTopics;
      },
      staleTime: 0,
    });
    return {
      topicListQuery,
      hasNextPage: topicListQuery.hasNextPage,
      isFetching: topicListQuery.isFetching,
      fetchNextPage: topicListQuery.fetchNextPage,
    };
  },

  useTopicMineList: () => {
    const queryKey = ['topic', 'list'];
    const topicListQuery = useInfiniteQuery({
      queryKey: queryKey,
      queryFn: async ({ pageParam }) => accountService().accountTopicList(pageParam),
      initialPageParam: { page: 1, size: 20 },
      getNextPageParam: getNextPageParam,
      select: (data) => {
        const allTopics = data.pages.flatMap((d) => d.list);

        return allTopics;
      },
      staleTime: 0,
    });
    return {
      topicListQuery,
      hasNextPage: topicListQuery.hasNextPage,
      isFetching: topicListQuery.isFetching,
      fetchNextPage: topicListQuery.fetchNextPage,
    };
  },

  useProfile: () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: async () => accountService().accountProfile(),
    });
  },
});
