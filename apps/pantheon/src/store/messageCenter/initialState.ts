import { UseQueryResult } from '@tanstack/react-query';

import {
  V1NotificationInfo,
  V1NotificationListReq,
  V1NotificationListRes,
  V1TaskTopicDetailReq,
  V1TaskTopicDetailRes,
} from '@/lib/http';

/**
 * @title slices切片的类型定义
 * @description 下面俩个为slices切片的类型定义
 */

export interface MessageListState {
  messageList: V1NotificationInfo[] | null;
  taskTopicDetail: V1TaskTopicDetailRes | null;
}
export interface TaskButtonGroupProps {
  item: V1NotificationInfo;
}

export interface MessageListActions {
  useFetchMessageList: (params: V1NotificationListReq) => UseQueryResult<V1NotificationListRes>;
  useGetTopicDetail: (params: V1TaskTopicDetailReq) => UseQueryResult<V1TaskTopicDetailRes>;
}

/**
 * @title 此为store中使用的初始状态定义
 */
export const initialMessageListState: MessageListState = {
  messageList: null,
  taskTopicDetail: null,
};
