import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const Layout = memo<PropsWithChildren>(({ children }) => {
  return (
    <Flexbox height={'100%'} horizontal width="100%">
      <p>Mobile Layout</p>
      {children}
    </Flexbox>
  );
});

Layout.displayName = 'MobileLayout';

export default Layout;
