import { ThemeMode } from 'antd-style';
import { StateCreator } from 'zustand/vanilla';

import { APP_THEME_APPEARANCE } from '@/const/theme';
import { LocaleMode } from '@/types/locale';
import { setCookie } from '@/utils/client/cookie';
import { switchLang } from '@/utils/client/switchLang';
import { isEqual } from '@/utils/isEqual';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

import { SystemStatus } from '../initialState';
import { GlobalStore } from '../store';

export interface GlobalGeneralAction {
  switchLocale: (locale: LocaleMode) => void;
  switchThemeMode: (themeMode: ThemeMode, params?: { skipBroadcast?: boolean }) => void;
  updateSystemStatus: (status: Partial<SystemStatus>, action?: any) => void;
}

const n = setNamespace('g');

export const generalActionSlice: StateCreator<
  GlobalStore,
  [['zustand/devtools', never]],
  [],
  GlobalGeneralAction
> = (set, get) => ({
  switchLocale: (locale) => {
    get().updateSystemStatus({ language: locale });

    switchLang(locale);
  },
  switchThemeMode: (themeMode, { skipBroadcast } = {}) => {
    get().updateSystemStatus({ themeMode });

    setCookie(APP_THEME_APPEARANCE, themeMode === 'auto' ? undefined : themeMode);
  },
  updateSystemStatus: (status, action) => {
    if (!get().isStatusInit) return;

    const nextStatus = merge(get().status, status);

    if (isEqual(get().status, nextStatus)) return;

    set({ status: nextStatus }, false, action || n('updateSystemStatus'));
    get().statusStorage.saveToLocalStorage(nextStatus);
  },
});
