import { PropsWithChildren, memo } from 'react';
import { Center } from 'react-layout-kit';

const AgoraLayout = memo<PropsWithChildren>(({ children }) => {
  return (
    <Center height={'100%'} width={'100%'}>
      {children}
    </Center>
  );
});

export default AgoraLayout;
