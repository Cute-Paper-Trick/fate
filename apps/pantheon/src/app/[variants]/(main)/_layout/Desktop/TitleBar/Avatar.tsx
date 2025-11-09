import { Suspense, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import UserAvatar from '@/features/User/UserAvatar';
import UserPanel from '@/features/User/UserPanel';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';

const Avatar = memo(() => {
  const [nickname, username] = useUserStore((s) => [
    userProfileSelectors.nickName(s),
    userProfileSelectors.username(s),
  ]);
  const content = (
    <Suspense fallback={<UserAvatar />}>
      <UserPanel>
        <Flexbox align="center" gap={8} horizontal justify="center">
          <Flexbox align="end" direction="vertical">
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{nickname}</span>
            <span style={{ fontSize: '12px', color: '#8b8b8b' }}>{username}</span>
          </Flexbox>
          <UserAvatar clickable />
        </Flexbox>
      </UserPanel>
    </Suspense>
  );

  return content;
});

Avatar.displayName = 'Avatar';

export default Avatar;
