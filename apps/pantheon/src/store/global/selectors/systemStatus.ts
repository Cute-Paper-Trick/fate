import { GlobalState, INITIAL_STATUS } from '../initialState';

const showAppPanel = (s: GlobalState) => s.status.showAppPanel;

export const systemStatus = (s: GlobalState) => s.status;

const themeMode = (s: GlobalState) => s.status.themeMode || 'auto';
const language = (s: GlobalState) => s.status.language || 'auto';

export const systemStatusSelectors = {
  showAppPanel,
  systemStatus,
  themeMode,
  language,
};
