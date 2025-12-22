import OSS from 'ali-oss';
import { DateTime } from 'luxon';
import { createStore } from 'zustand/vanilla';

import { V1CommonSignStsRes, commonService } from '@/lib/http';

interface OssState {
  sts: V1CommonSignStsRes | null;
  refreshPromise: Promise<V1CommonSignStsRes> | null;
}

interface OssActions {
  // signature: (key: string, process?: string) => Promise<string>;
  getClient: () => OSS;
  refreshSTSToken: () => Promise<V1CommonSignStsRes>;
  ensureSTS: () => Promise<void>;
}

type OssStore = OssState & OssActions;

export const ossStore = createStore<OssStore>((set, get) => ({
  sts: null,
  refreshing: false,

  refreshPromise: null,

  refreshSTSToken: async () => {
    const stsPromise = get().refreshPromise;

    if (stsPromise) {
      return stsPromise;
    }

    const _promise = (async () => {
      try {
        const stsData: V1CommonSignStsRes = await commonService().commonSignSts();
        set({ sts: stsData });
        return stsData;
      } finally {
        set({ refreshPromise: null });
      }
    })();

    set({ refreshPromise: _promise });

    return _promise;
  },

  getClient() {
    const sts = get().sts;

    if (!sts) {
      throw new Error('STS is not available');
    }

    return new OSS({
      region: 'oss-cn-beijing',
      accessKeyId: sts.accessKeyId,
      accessKeySecret: sts.accessKeySecret,
      stsToken: sts.stsToken,
      bucket: 'pantheon-code',
      secure: sts.secure,
      refreshSTSToken: get().refreshSTSToken,
    });
  },

  async ensureSTS() {
    const sts = get().sts;
    if (!sts?.expiration || DateTime.fromISO(sts.expiration) < DateTime.now()) {
      await get().refreshSTSToken();
    }
  },

  async signature(key: string, process?: string) {
    const sts = get().sts;

    if (!sts?.expiration || DateTime.fromISO(sts.expiration) < DateTime.now()) {
      await get().refreshSTSToken();
    }

    const url = get().getClient().signatureUrl(key, { process });

    return url;
  },
}));
