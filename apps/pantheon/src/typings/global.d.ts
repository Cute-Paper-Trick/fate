declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
// declare module '*.scss' {
//   const classes: { [key: string]: string };
//   export default classes;
// }
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

interface Window {
  /** Ant-design-vue message instance */
  $message?: import('antd/es/message/interface').MessageInstance;
  /** Ant-design-vue modal instance */
  $modal?: Omit<import('antd/es/modal/confirm').ModalStaticFunctions, 'warn'>;
  /** Ant-design-vue notification instance */
  $notification?: import('antd/es/notification/interface').NotificationInstance;
  /** NProgress instance */
  // NProgress?: import('nprogress').NProgress;
  // $navigate: typeof import('@/router').$navigate;
}

declare global {
  var $message: import('antd/es/message/interface').MessageInstance;
  var $modal: Omit<import('antd/es/modal/confirm').ModalStaticFunctions, 'warn'>;
  var $notification: import('antd/es/notification/interface').NotificationInstance;
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}

/** Build time of the project */
declare const BUILD_TIME: string;
