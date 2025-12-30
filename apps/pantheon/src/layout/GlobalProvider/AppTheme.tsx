'use client';

import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, ThemeProvider } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import AntdStaticMethods from '@/components/AntdStaticMethods';
import { GlobalStyle } from '@/styles';
import '@/styles/globals.css';

const useStyles = createStyles(({ css, token }) => ({
  app: css`
    position: relative;

    overscroll-behavior: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    min-height: 100dvh;
    max-height: 100dvh;

    @media (min-device-width: 576px) {
      overflow: hidden;
    }
  `,
  // scrollbar-width and scrollbar-color are supported from Chrome 121
  // https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color
  scrollbar: css`
    scrollbar-color: ${token.colorFill} transparent;
    scrollbar-width: thin;

    #lobe-mobile-scroll-container {
      scrollbar-width: none;

      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  `,

  // so this is a polyfill for older browsers
  scrollbarPolyfill: css`
    ::-webkit-scrollbar {
      width: 0.75em;
      height: 0.75em;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }

    :hover::-webkit-scrollbar-thumb {
      border: 3px solid transparent;
      background-color: ${token.colorText};
      background-clip: content-box;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `,
}));

export interface AppThemeProps {
  children?: React.ReactNode;
}

const AppTheme = memo<AppThemeProps>(({ children }) => {
  const { styles, cx } = useStyles();

  return (
    <ThemeProvider
      className={cx(styles.app, styles.scrollbar, styles.scrollbarPolyfill)}
      theme={{
        cssVar: true,
        token: {
          // fontFamily: customFontFamily ? `${customFontFamily},${theme.fontFamily}` : undefined,
          // motion: animationMode !== 'disabled',
          // motionUnit: animationMode === 'agile' ? 0.05 : 0.1,
        },
      }}
    >
      <>
        <GlobalStyle />
        <AntdStaticMethods />
        <ConfigProvider
          config={{
            aAs: Link,
            imgAs: Image,
            imgUnoptimized: true,
          }}
        >
          {children}
        </ConfigProvider>
      </>
    </ThemeProvider>
  );
});

AppTheme.displayName = 'AppTheme';

export default AppTheme;
