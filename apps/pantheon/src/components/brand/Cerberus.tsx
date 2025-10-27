import { useTheme } from 'antd-style';
import { ReactNode, memo } from 'react';
import { DivProps, Flexbox } from 'react-layout-kit';

import CerberusLogo from './CerberusLogo';
import CerberusText from './CerberusText';
import Divider from './components/Divider';
import { useStyles } from './style';

export interface CerberusProps extends DivProps {
  extra?: ReactNode;
  size?: number;
  type?: '3d' | 'flat' | 'mono' | 'text' | 'combine';
}

const Cerberus = memo<CerberusProps>(({ type, size = 32, style, extra, className, ...rest }) => {
  const theme = useTheme();

  const { styles } = useStyles();

  let logoComponent: ReactNode;

  switch (type) {
    case '3d': {
      logoComponent = <CerberusLogo size={size} {...rest} />;
      break;
    }
    case 'flat': {
      // logoComponent = <LogoFlat size={size} style={style} />;
      // break;
    }
    case 'mono': {
      // logoComponent = <LogoMono size={size} style={style} />;
      // break;
    }
    case 'text': {
      logoComponent = (
        <CerberusText className={className} size={size} style={style} {...(rest as any)} />
      );
      break;
    }
    case 'combine': {
      logoComponent = (
        <>
          <CerberusLogo alt="LobeChat" size={size} />
          <CerberusText size={size} style={{ marginLeft: Math.round(size / 4) }} />
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

Cerberus.displayName = 'CerberusBrand';

export default Cerberus;
