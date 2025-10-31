'use client';

import { useEffect } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { useSession } from '@/features/cerberus/client';
import { useUserStore } from '@/store/user';
import { FateUser } from '@/types/user';

const UserUpdater = () => {
  const { data: session, isPending: isLoading } = useSession();

  console.log('>>>>>>>>>', session);

  const isSignedIn = (!!session && !!session.user) || false;

  const user = session?.user;

  const useStoreUpdater = createStoreUpdater(useUserStore);

  useStoreUpdater('user', user);
  useStoreUpdater('session', session);
  useStoreUpdater('isSignedIn', isSignedIn);

  // 使用 useEffect 处理需要保持同步的用户数据
  useEffect(() => {
    if (user) {
      // const userAvatar = useUserStore.getState().user?.image;

      // const fateUser: FateUser = {
      //   id: user.id,
      //   createdAt: user.createdAt,
      //   updatedAt: user.updatedAt,
      //   email: user.email,
      //   emailVerified: user.emailVerified,
      //   name: user.name,
      //   image: userAvatar,
      // };

      useUserStore.setState({ user });
    }
  }, [user]);

  return null;
};

export default UserUpdater;
