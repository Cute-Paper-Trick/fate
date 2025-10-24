import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit/lib/Flexbox';

const Layout = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox horizontal height={'100%'} width="100%">
      <p>Mobile Layout</p>
      {children}
    </Flexbox>
  );
});

Layout.displayName = 'MobileLayout';

export default Layout;
