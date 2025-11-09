import { V1CommonSignStsRes } from '@/lib/http';

export interface OssState {
  sts: V1CommonSignStsRes | null;
  refreshPromise: Promise<V1CommonSignStsRes> | null;
}

export const initialOssState: OssState = {
  sts: null,
  refreshPromise: null,
};
