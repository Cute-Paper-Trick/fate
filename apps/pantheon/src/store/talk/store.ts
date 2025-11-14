import { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { TopicStoreState, initialState } from './initailState';
import { TopicAction, createTopicSlice } from './slices/topic/actions';

export type TopicStore = TopicStoreState & TopicAction;

const createStore: StateCreator<TopicStore, [['zustand/devtools', never]], []> = (
  ...parameters
) => ({
  ...initialState,

  ...createTopicSlice(...parameters),
});

const devtools = createDevtools('topic');

export const useTopicStore = createWithEqualityFn<TopicStore>()(devtools(createStore), shallow);

export const getTopicStoreState = () => useTopicStore.getState();
