import { OssState, initialOssState } from './slices/oss/initialState';

export type OssStsStoreState = OssState;

export const initialState: OssStsStoreState = {
  ...initialOssState,
};
