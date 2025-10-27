import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

import GlobalProvider from '@/layout/GlobalProvider';
import { getTranslate } from '@/locales/server';
import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/server/routeVariants';

interface RootLayoutProps extends DynamicLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { variants } = await params;

  const { locale, isMobile, theme, primaryColor, neutralColor } =
    RouteVariants.deserializeVariants(variants);

  const direction = 'ltr';

  const t = await getTranslate();

  return (
    <html dir={direction} lang={locale}>
      <head>
        {process.env.ENABLE_REACT_SCAN === '1' && (
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <body>
        <NuqsAdapter>
          <GlobalProvider>
            {/* <AuthProvider> */}
            {children}
            {/* </AuthProvider> */}
          </GlobalProvider>
          {/* <Analytics /> */}
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default RootLayout;
