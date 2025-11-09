import NProgress from '@/components/NProgress';

import AuthProvider from '../AuthProvider/BetterAuth';
import AnalyticsProvider from './Analytics';
import AppTheme from './AppTheme';
import Locale from './Locale';
import QueryProvider from './Query';
import S3Provider from './S3';

type GlobalLayoutProps = React.PropsWithChildren;

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <AnalyticsProvider>
      <AppTheme>
        <Locale defaultLang={'zh'}>
          <S3Provider>
            <AuthProvider>
              <QueryProvider>
                <NProgress />
                {children}
              </QueryProvider>
            </AuthProvider>
          </S3Provider>
        </Locale>
      </AppTheme>
    </AnalyticsProvider>
  );
};

export default GlobalLayout;
