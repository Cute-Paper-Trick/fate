'use client';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const DesktopImageClassifier = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width="100%">
      {children}
    </Flexbox>
  );
});

DesktopImageClassifier.displayName = 'DesktopImageClassifier';

export default DesktopImageClassifier;
