import { OssState, initialOssState } from './slices/oss/initialState';

export type S3StoreState = OssState;

export const initialState: S3StoreState = {
  ...initialOssState,
};
