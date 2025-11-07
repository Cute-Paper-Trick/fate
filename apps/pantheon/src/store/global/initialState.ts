import { ThemeMode } from 'antd-style';

import { LocaleMode } from '@/types/locale';
import { AsyncLocalStorage } from '@/utils/localStorage';

export interface SystemStatus {
  showAppPanel: boolean;
  language?: LocaleMode;
  themeMode?: ThemeMode;
}

export enum ProfileTabs {
  APIKey = 'apikey',
  Profile = 'profile',
  Security = 'security',
  Stats = 'stats',
}

export const INITIAL_STATUS = {
  showAppPanel: false,
} satisfies SystemStatus;

export interface GlobalState {
  isStatusInit?: boolean;
  status: SystemStatus;
  statusStorage: AsyncLocalStorage<SystemStatus>;
}

export enum AppFuncs {
  Chat = 'chat',
  Talk = 'talk',
  Task = 'task',
  Lab = 'lab',
  Settings = 'settings',
}

export const initialState: GlobalState = {
  isStatusInit: true,
  status: INITIAL_STATUS,
  statusStorage: new AsyncLocalStorage('PANTHEON_SYSTEM_STATUS'),
};
