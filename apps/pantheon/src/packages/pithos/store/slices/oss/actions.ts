import OSS from 'ali-oss';
// import { DateTime } from 'luxon';
import { StateCreator } from 'zustand';

import { agoraEnv } from '@/envs/agora';
import { V1CommonSignStsRes, commonService } from '@/lib/http';

import { OssStsStore } from '../../store';

export interface OssAction {
  refreshSTSToken: () => Promise<V1CommonSignStsRes>;
  getClient: () => Promise<OSS>;
}

export const createOssSlice: StateCreator<
  OssStsStore,
  [['zustand/devtools', never]],
  [],
  OssAction
> = (set, get) => ({
  getClient: async () => {
    let sts = get().sts;
    if (!sts) {
      sts = await get().refreshSTSToken();
    }

    return new OSS({
      bucket: agoraEnv.NEXT_PUBLIC_AGORA_S3_BUCKET,
      region: agoraEnv.NEXT_PUBLIC_AGORA_S3_REGION,
      secure: true,
      accessKeyId: sts.accessKeyId,
      accessKeySecret: sts.accessKeySecret,
      stsToken: sts.stsToken,
      refreshSTSToken: get().refreshSTSToken,
    });
  },

  refreshSTSToken: async () => {
    const refreshPromise = get().refreshPromise;

    if (refreshPromise) {
      return refreshPromise;
    }

    const promise = (async () => {
      try {
        const stsData = await commonService().commonSignSts();
        set({ sts: stsData });
        return stsData;
      } finally {
        set({ refreshPromise: null });
      }
    })();

    set({ refreshPromise: promise });

    return promise;
  },
});
