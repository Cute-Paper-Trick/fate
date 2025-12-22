import { useTheme } from 'antd-style';
import { ReactNode, memo } from 'react';
import { DivProps, Flexbox } from 'react-layout-kit';

import Divider from './components/Divider';
import PantheonLogo from './PantheonLogo';
import PantheonText from './PantheonText';
import { useStyles } from './style';

export interface PantheonProps extends DivProps {
  extra?: ReactNode;
  size?: number;
  type?: '3d' | 'flat' | 'mono' | 'text' | 'combine';
}

const Pantheon = memo<PantheonProps>(({ type, size = 32, style, extra, className, ...rest }) => {
  const theme = useTheme();

  const { styles } = useStyles();

  let logoComponent: ReactNode;

  switch (type) {
    case '3d': {
      logoComponent = <PantheonLogo size={size} {...rest} />;
      break;
    }
    case 'flat':
    case 'mono':
    case 'text': {
      logoComponent = (
        <PantheonText className={className} size={size} style={style} {...(rest as any)} />
      );
      break;
    }
    case 'combine': {
      logoComponent = (
        <>
          <PantheonLogo alt="Pantheon" size={size} />
          <PantheonText size={size} style={{ marginLeft: Math.round(size / 4) }} />
        </>
      );

      if (!extra)
        logoComponent = (
          <Flexbox align={'center'} className={className} flex={'none'} horizontal style={style}>
            {logoComponent}
          </Flexbox>
        );

      break;
    }
  }

  if (!extra) return logoComponent;

  const extraSize = Math.round((size / 3) * 1.9);

  return (
    <Flexbox
      align={'center'}
      className={className}
      flex={'none'}
      horizontal
      style={style}
      {...rest}
    >
      {logoComponent}
      <Divider size={extraSize} style={{ color: theme.colorFill }} />
      <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
        {extra}
      </div>
    </Flexbox>
  );
});

Pantheon.displayName = 'PantheonBrand';

export default Pantheon;
