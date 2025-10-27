import { Suspense, memo } from 'react';

const Avatar = memo(() => {
  const content = <div>Avatar</div>;
  // const content = (
  //   <Suspense fallback={<UserAvatar />}>
  //     <UserPanel>
  //       <UserAvatar clickable />
  //     </UserPanel>
  //   </Suspense>
  // );

  return content;
});

Avatar.displayName = 'Avatar';

export default Avatar;
