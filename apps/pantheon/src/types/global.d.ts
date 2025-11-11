import type { LobeCustomStylish, LobeCustomToken } from '@lobehub/ui';

import 'antd-style';
import { AntdToken } from 'antd-style/lib/types/theme';

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  export interface CustomToken extends LobeCustomToken {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  export interface CustomStylish extends LobeCustomStylish {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends AntdToken, LobeCustomToken {}
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
