import { Session } from '@/features/cerberus/client';
import { FateUser } from '@/types/user';

export interface UserAuthState {
  isSignedIn?: boolean;
  user?: FateUser;
  session?: Session | null;
}

export const initialAuthState: UserAuthState = {
  isSignedIn: false,
  user: undefined,
  session: null,
};
