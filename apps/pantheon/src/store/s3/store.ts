import { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { S3StoreState, initialState } from './initailState';
import { OssAction, createOssSlice } from './slices/oss/actions';

export type S3Store = S3StoreState & OssAction;

const createStore: StateCreator<S3Store, [['zustand/devtools', never]], []> = (...parameters) => ({
  ...initialState,

  ...createOssSlice(...parameters),
});

const devtools = createDevtools('s3');

export const useS3Store = createWithEqualityFn<S3Store>()(devtools(createStore), shallow);

export const getS3StoreState = () => useS3Store.getState();
