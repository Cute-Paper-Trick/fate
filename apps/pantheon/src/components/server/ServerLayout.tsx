import { FC, PropsWithChildren, ReactNode } from 'react';

import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/server/routeVariants';

interface ServerLayoutProps<T> {
  Desktop: FC<T>;
  Mobile: FC<T>;
}

interface ServerLayoutInnerProps extends DynamicLayoutProps {
  children: ReactNode;
}

/**
 * 用于在 Next.js 服务端组件中实现响应式布局切换。
 * 服务端设备检测: 在服务端通过 RouteVariants.getIsMobile() 检测用户设备类型(移动端/桌面端)
 * 条件渲染: 根据设备类型自动渲染对应的布局组件:
 *  移动端 → 渲染 Mobile 组件
 *  桌面端 → 渲染 Desktop 组件
 *
 * 服务端渲染优化: 在服务端就确定布局,避免客户端闪烁
 * 代码分离: 桌面和移动端布局逻辑完全解耦
 * 性能优化: 只渲染当前设备需要的组件,减少传输体积
 */
const ServerLayout =
  <T extends PropsWithChildren>({ Desktop, Mobile }: ServerLayoutProps<T>): FC<T> =>
  // @ts-expect-error
  async (props: ServerLayoutInnerProps) => {
    const { params: paramsPromise, ...res } = props;
    if (!paramsPromise) {
      throw new Error(
        `paramsPromise is required for ServerLayout, please pass params props to ServerLayout`,
      );
    }

    const isMobile = await RouteVariants.getIsMobile(props);

    return (
      <>
        <p>ServerLayout</p>
        {isMobile ? <Mobile {...(res as T)} /> : <Desktop {...(res as T)} />}
      </>
    );
  };

export default ServerLayout;
