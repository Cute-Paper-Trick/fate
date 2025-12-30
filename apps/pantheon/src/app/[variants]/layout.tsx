import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

import GlobalProvider from '@/layout/GlobalProvider';
import '@/styles/globals.css';
import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/server/routeVariants';

import '../globals.css';

interface RootLayoutProps extends DynamicLayoutProps {
  children: ReactNode;
  modal?: ReactNode;
}

const RootLayout = async ({ children, params, modal }: RootLayoutProps) => {
  const { variants } = await params;

  const {
    locale,
    // isMobile,
    //  theme,
    //  primaryColor,
    //  neutralColor
  } = RouteVariants.deserializeVariants(variants);

  const direction = 'ltr';

  return (
    <html dir={direction} lang={locale}>
      <head>
        {process.env.ENABLE_REACT_SCAN === '1' && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <body>
        <NuqsAdapter>
          <GlobalProvider>
            {/* <AuthProvider> */}
            {children}
            {modal}
            {/* </AuthProvider> */}
          </GlobalProvider>
          {/* <Analytics /> */}
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default RootLayout;
