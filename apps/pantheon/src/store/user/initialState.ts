import { UserAuthState, initialAuthState } from './slices/auth/initialState';

export type UserState = UserAuthState;

export const initialState: UserState = {
  ...initialAuthState,
};
