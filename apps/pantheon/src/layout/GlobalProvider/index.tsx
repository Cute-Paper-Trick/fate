import Locale from './Locale';
import QueryProvider from './Query';

interface GlobalLayoutProps extends React.PropsWithChildren {}

const GlobalLayout = ({ children, ...rest }: GlobalLayoutProps) => {
  console.log(rest);
  return (
    <Locale defaultLang={'zh'}>
      <QueryProvider>
        <p>GLobalLayout</p>
        {children}
      </QueryProvider>
    </Locale>
  );
};

export default GlobalLayout;
