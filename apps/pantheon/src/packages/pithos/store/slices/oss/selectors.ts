// import { DateTime } from 'luxon';
import { OssStsStore } from '../../store';

// export const isTokenExpired = (state: OssStsStore): boolean => {
//   if (!state.sts?.expiration) return true;
//   return DateTime.fromISO(state.sts.expiration) < DateTime.now();
// };

export const ossSelectors = {
  sts: (state: OssStsStore) => state.sts,
};
