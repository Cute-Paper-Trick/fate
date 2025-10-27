'use client';

import { ConfigProvider, ThemeProvider } from '@lobehub/ui';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

export interface AppThemeProps {
  children?: React.ReactNode;
}

const AppTheme = memo<AppThemeProps>(({ children }) => {
  return (
    <ThemeProvider>
      <ConfigProvider
        config={{
          aAs: Link,
          imgAs: Image,
          imgUnoptimized: true,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeProvider>
  );
});

AppTheme.displayName = 'AppTheme';

export default AppTheme;
