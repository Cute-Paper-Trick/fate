'use client';

import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Menu from '@/components/Menu';
import { authClient } from '@/features/cerberus/client';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

import UserLogin from '../Login';
import UserInfo from '../UserInfo';
// import LangButton from './LangButton';
// import ThemeButton from './ThemeButton';
import { useMenu } from './useMenu';

interface PannelContentProps {
  closePopover: () => void;
}

const PannelContent = memo<PannelContentProps>(({ closePopover }) => {
  const router = useRouter();

  const isLoginWithAuth = useUserStore((s) => authSelectors.isLogin(s));

  const { mainItems, logoutItems } = useMenu();

  const handleSignIn = () => {
    closePopover();
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace('/auth/sign-in');
          },
        },
      });
    } finally {
      closePopover();
    }
  };

  return (
    <Flexbox gap={2} style={{ minWidth: 300 }}>
      {isLoginWithAuth ? (
        <UserInfo avatarProps={{ clickable: false }} />
      ) : (
        <UserLogin onClick={handleSignIn} />
      )}

      <Menu items={mainItems} mode="inline" onClick={closePopover} />

      <Flexbox
        align={'center'}
        horizontal
        justify={'space-between'}
        style={isLoginWithAuth ? { paddingRight: 6 } : { padding: '6px 6px 6px 16px' }}
      >
        {/* {isLoginWithAuth ? ( */}
        <Menu items={logoutItems} onClick={handleSignOut} />
        {/* ) : ( */}
        {/* <BrandWatermark /> */}
        {/* )} */}
        <Flexbox align={'center'} flex={'none'} gap={2} horizontal>
          {/* <LangButton /> */}
          {/* <ThemeButton /> */}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default PannelContent;
