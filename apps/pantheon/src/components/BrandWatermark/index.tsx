'use client';

import { createStyles } from 'antd-style';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Pantheon from '../brand/Pantheon';

// import { ORG_NAME } from '@/const/branding';
// import { UTM_SOURCE } from '@/const/url';
// import { isCustomORG } from '@/const/version';

const ORG_NAME = 'Pantheon';
// const UTM_SOURCE = 'pantheon_app';
const isCustomORG = false;

const useStyles = createStyles(({ token, css }) => ({
  logoLink: css`
    line-height: 1;
    color: inherit;

    &:hover {
      color: ${token.colorLink};
    }
  `,
}));

const BrandWatermark = memo<Omit<FlexboxProps, 'children'>>(({ style, ...rest }) => {
  const { styles, theme } = useStyles();
  return (
    <Flexbox
      align={'center'}
      dir={'ltr'}
      flex={'none'}
      gap={4}
      horizontal
      style={{ color: theme.colorTextDescription, fontSize: 12, ...style }}
      {...rest}
    >
      <span>Powered by</span>
      {isCustomORG ? (
        <span>{ORG_NAME}</span>
      ) : (
        <Link className={styles.logoLink} href={`#`}>
          <Pantheon size={20} type={'text'} />
        </Link>
      )}
    </Flexbox>
  );
});

export default BrandWatermark;
