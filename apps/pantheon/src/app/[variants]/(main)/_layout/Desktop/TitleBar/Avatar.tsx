import { Suspense, memo } from 'react';

import UserAvatar from '@/features/User/UserAvatar';
import UserPanel from '@/features/User/UserPanel';

const Avatar = memo(() => {
  const content = (
    <Suspense fallback={<UserAvatar />}>
      <UserPanel>
        <UserAvatar clickable />
      </UserPanel>
    </Suspense>
  );

  return content;
});

Avatar.displayName = 'Avatar';

export default Avatar;
