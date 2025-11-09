import OSS from 'ali-oss';
import { DateTime } from 'luxon';
import { StateCreator } from 'zustand';

import { V1CommonSignStsRes, commonService } from '@/lib/http';

import { S3Store } from '../../store';

export interface OssAction {
  signature: (key: string, process?: string) => Promise<string>;
  client: () => OSS;
  refreshSTSToken: () => Promise<V1CommonSignStsRes>;
}

export const createOssSlice: StateCreator<S3Store, [['zustand/devtools', never]], [], OssAction> = (
  set,
  get,
) => ({
  client: () => {
    const sts = get().sts;
    if (!sts) {
      throw new Error('OSS 初始化失败，STS 不可用');
    }

    return new OSS({
      region: sts.region,
      accessKeyId: sts.accessKeyId,
      accessKeySecret: sts.accessKeySecret,
      stsToken: sts.stsToken,
      bucket: sts.bucket,
      secure: sts.secure,
      refreshSTSToken: get().refreshSTSToken,
    });
  },

  signature: async (key: string, process?: string) => {
    const sts = get().sts;

    if (!sts?.expiration || DateTime.fromISO(sts.expiration) < DateTime.now()) {
      await get().refreshSTSToken();
    }

    const url = get().client().signatureUrl(key, { process });

    return url;
  },

  refreshSTSToken: async () => {
    const stsPromise = get().refreshPromise;
    if (stsPromise) {
      return stsPromise;
    }

    const _promise = (async () => {
      try {
        const stsData = await commonService().commonSignSts();
        set({ sts: stsData });
        return stsData;
      } finally {
        set({ refreshPromise: null });
      }
    })();

    set({ refreshPromise: _promise });

    return _promise;
  },
});
