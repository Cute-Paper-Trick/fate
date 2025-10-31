import { UserStore } from '@/store/user';

const nickName = (s: UserStore) => {
  const defaultNickName = s.user?.displayUsername || s.user?.name;
  if (s.isSignedIn) return defaultNickName;
};

const username = (s: UserStore) => s.user?.username || s.user?.email?.split('@')[0] || '';

export const userProfileSelectors = {
  displayUserName: (s: UserStore): string => nickName(s) || s.user?.email || '',
  nickName,
  avatar: (s: UserStore) => s.user?.image,
  userId: (s: UserStore) => s.user?.id,
  username,
};

const isLogin = (s: UserStore) => !!s.isSignedIn;

export const authSelectors = {
  isLogin,
};
