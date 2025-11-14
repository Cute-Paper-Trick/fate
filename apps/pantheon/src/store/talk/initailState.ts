import { TopicState, initialTopicState } from './slices/topic/initialState';

export type TopicStoreState = TopicState;

export const initialState: TopicStoreState = {
  ...initialTopicState,
};
