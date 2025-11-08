'use client';

import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const TalkLayout = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox
      direction="vertical"
      height={'100%'}
      style={{ height: '100vh', position: 'relative', borderTop: undefined }}
      width={'100%'}
    >
      <Flexbox direction="vertical" height={'100%'} style={{ position: 'relative' }} width="100%">
        {children}
      </Flexbox>
    </Flexbox>
  );
});

TalkLayout.displayName = 'DesktopTalkLayout';

export default TalkLayout;
