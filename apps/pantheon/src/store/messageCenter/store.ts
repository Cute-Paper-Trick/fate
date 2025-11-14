import { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { MessageListActions, MessageListState, initialMessageListState } from './initialState';
import { createTaskSlice } from './slices/actions';

export type MessageCenterStore = MessageListState & MessageListActions;

const createStore: StateCreator<MessageCenterStore, [['zustand/devtools', never]], []> = (
  ...parameters
) => ({
  ...initialMessageListState,
  ...createTaskSlice(...parameters),
});

const devtools = createDevtools('MessageCenter');

export const useMessageCenterStore = createWithEqualityFn<MessageCenterStore>()(
  devtools(createStore),
  shallow,
);

export const getMessageCenterStoreState = () => useMessageCenterStore.getState();
