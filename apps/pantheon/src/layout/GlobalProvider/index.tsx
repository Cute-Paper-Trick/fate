import AuthProvider from '../AuthProvider/BetterAuth';
import AnalyticsProvider from './Analytics';
import AppTheme from './AppTheme';
import Locale from './Locale';
import QueryProvider from './Query';

type GlobalLayoutProps = React.PropsWithChildren;

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <AnalyticsProvider>
      <Locale defaultLang={'zh'}>
        <AuthProvider>
          <AppTheme>
            <QueryProvider>{children}</QueryProvider>
          </AppTheme>
        </AuthProvider>
      </Locale>
    </AnalyticsProvider>
  );
};

export default GlobalLayout;
