import { StateCreator } from 'zustand/vanilla';

import { isEqual } from '@/utils/isEqual';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

import { SystemStatus } from '../initialState';
import { GlobalStore } from '../store';

export interface GlobalGeneralAction {
  updateSystemStatus: (status: Partial<SystemStatus>, action?: any) => void;
}

const n = setNamespace('g');

export const generalActionSlice: StateCreator<
  GlobalStore,
  [['zustand/devtools', never]],
  [],
  GlobalGeneralAction
> = (set, get) => ({
  updateSystemStatus: (status, action) => {
    if (!get().isStatusInit) return;

    const nextStatus = merge(get().status, status);

    if (isEqual(get().status, nextStatus)) return;

    set({ status: nextStatus }, false, action || n('updateSystemStatus'));
    get().statusStorage.saveToLocalStorage(nextStatus);
  },
});
