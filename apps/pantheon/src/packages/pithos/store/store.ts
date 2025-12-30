import { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '@/store/middleware/createDevtools';

import { OssStsStoreState, initialState } from './initialState';
import { OssAction, createOssSlice } from './slices/oss/actions';

export type OssStsStore = OssStsStoreState & OssAction;

const createStore: StateCreator<OssStsStore, [['zustand/devtools', never]], []> = (...parameters) => ({
  ...initialState,

  ...createOssSlice(...parameters),
});

const devtools = createDevtools('ossSts');

export const useOssStsStore = createWithEqualityFn<OssStsStore>()(devtools(createStore), shallow);

export const getOssStsStoreState = () => useOssStsStore.getState();
