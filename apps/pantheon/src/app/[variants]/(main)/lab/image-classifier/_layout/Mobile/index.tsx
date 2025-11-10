'use client';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const MobileImageClassifier = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width="100%">
      {children}
    </Flexbox>
  );
});

MobileImageClassifier.displayName = 'MobileImageClassifier';

export default MobileImageClassifier;
