import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const TalkLayout = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox height={'100%'} horizontal width="100%">
      <p>Mobile TalkLayout</p>
      {children}
    </Flexbox>
  );
});

TalkLayout.displayName = 'MobileTalkLayout';

export default TalkLayout;
