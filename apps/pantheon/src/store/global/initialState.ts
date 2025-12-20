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

export enum AppTab {
  Chat = 'chat',
  Learning = 'learning',
  Talk = 'talk',
  Lab = 'lab',
  Settings = 'settings',
  Discover = 'discover',
  Articles = 'discover/articles',
  Collections = 'discover/collections',
  File = 'files',
  aiImage = 'image',
}

export const initialState: GlobalState = {
  isStatusInit: true,
  status: INITIAL_STATUS,
  statusStorage: new AsyncLocalStorage('PANTHEON_SYSTEM_STATUS'),
};
