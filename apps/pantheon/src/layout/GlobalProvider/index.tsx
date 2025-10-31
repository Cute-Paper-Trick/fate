import AuthProvider from '../AuthProvider/BetterAuth';
import AnalyticsProvider from './Analytics';
import AppTheme from './AppTheme';
import Locale from './Locale';
import QueryProvider from './Query';

interface GlobalLayoutProps extends React.PropsWithChildren {}

const GlobalLayout = ({ children, ...rest }: GlobalLayoutProps) => {
  return (
    <AnalyticsProvider>
      <AuthProvider>
        <Locale defaultLang={'zh'}>
          <AppTheme>
            <QueryProvider>{children}</QueryProvider>
          </AppTheme>
        </Locale>
      </AuthProvider>
    </AnalyticsProvider>
  );
};

export default GlobalLayout;
