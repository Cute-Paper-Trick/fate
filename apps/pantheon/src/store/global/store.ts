import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { GlobalGeneralAction, generalActionSlice } from './actions/general';
import { type GlobalState, initialState } from './initialState';

export interface GlobalStore extends GlobalState, GlobalGeneralAction {}

const createStore: StateCreator<GlobalStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...generalActionSlice(...parameters),
});

const devtools = createDevtools('global');

export const useGlobalStore = createWithEqualityFn<GlobalStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
