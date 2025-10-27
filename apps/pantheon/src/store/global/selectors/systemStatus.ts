import { GlobalState, INITIAL_STATUS } from '../initialState';

const showAppPanel = (s: GlobalState) => s.status.showAppPanel;

export const systemStatus = (s: GlobalState) => s.status;

export const systemStatusSelectors = {
  showAppPanel,
  systemStatus,
};
