import { StateCreator } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { UserState, initialState } from './initialState';
import { UserAuthAction, createAuthSlice } from './slices/auth/actions';

export type UserStore = UserState & UserAuthAction;

const createStore: StateCreator<UserStore, [['zustand/devtools', never]], []> = (
  ...parameters
) => ({
  ...initialState,
  ...createAuthSlice(...parameters),
});

const devtools = createDevtools('user');

export const useUserStore = createWithEqualityFn<UserStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);

export const getUserStoreState = () => useUserStore.getState();
