import { StateCreator } from 'zustand';

import { authClient } from '@/features/cerberus/client';
import { FateUser } from '@/types/user';

import { UserStore } from '../../store';

export interface UserAuthAction {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: (user: FateUser | undefined) => void;
}

export const createAuthSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  UserAuthAction
> = (set, get) => ({
  login: async (email: string, password: string) => {
    // try {
    //   const { data, error } = await authClient.signIn.email({
    //     email,
    //     password,
    //   });
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    //   if (data?.session && data?.user) {
    //     const fateUser: FateUser = {
    //       id: data.user.id,
    //       username: data.user.name,
    //       email: data.user.email,
    //       avatar: data.user.image || undefined,
    //       nickname: data.user.name,
    //     };
    //     set({ isSignedIn: true, user: fateUser, session: data.session });
    //   }
    // } catch (error) {
    //   console.error('Login error:', error);
    //   throw error;
    // }
  },

  logout: async () => {
    // try {
    //   await authClient.signOut();
    //   set({ isSignedIn: false, user: undefined, session: null });
    // } catch (error) {
    //   console.error('Logout error:', error);
    //   throw error;
    // }
  },

  refreshSession: async () => {
    try {
      const { data } = await authClient.getSession();

      if (data?.session && data?.user) {
        const fateUser: FateUser = {
          id: data.user.id,
          username: data.user.name,
          email: data.user.email,
          avatar: data.user.image || undefined,
          nickname: data.user.name,
        };

        set({ isSignedIn: true, user: fateUser, session: data.session });
      } else {
        set({ isSignedIn: false, user: undefined, session: null });
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      set({ isSignedIn: false, user: undefined, session: null });
    }
  },

  setUser: (user: FateUser | undefined) => {
    set({ user, isSignedIn: !!user });
  },
});
