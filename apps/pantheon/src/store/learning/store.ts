import { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { TaskListActions, TaskListState, initialTaskListState } from './initialState';
import { createTaskSlice } from './slices/task/actions';

export type LearningStore = TaskListState & TaskListActions;

const createStore: StateCreator<LearningStore, [['zustand/devtools', never]], []> = (
  ...parameters
) => ({
  ...initialTaskListState,
  ...createTaskSlice(...parameters),
});

const devtools = createDevtools('learning');

export const useLearningStore = createWithEqualityFn<LearningStore>()(
  devtools(createStore),
  shallow,
);

export const getLearningStoreState = () => useLearningStore.getState();
