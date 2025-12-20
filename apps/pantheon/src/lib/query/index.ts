'use client';

import { QueryClient } from '@tanstack/react-query';

import { apiErrorHandler } from '../http/errorHandler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1分钟内不会重新请求
      staleTime: 1 * 60 * 1000,
      // 缓存保留10分钟
      gcTime: 1 * 60 * 1000,
      // retry: 1,
      // 窗口聚焦时不自动重新请求
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError(error) {
        apiErrorHandler(error);
      },
    },
  },
});
