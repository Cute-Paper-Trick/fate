import AppTheme from './AppTheme';
import Locale from './Locale';
import QueryProvider from './Query';

interface GlobalLayoutProps extends React.PropsWithChildren {}

const GlobalLayout = ({ children, ...rest }: GlobalLayoutProps) => {
  console.log(rest);
  return (
    <Locale defaultLang={'zh'}>
      <AppTheme>
        <QueryProvider>{children}</QueryProvider>
      </AppTheme>
    </Locale>
  );
};

export default GlobalLayout;
