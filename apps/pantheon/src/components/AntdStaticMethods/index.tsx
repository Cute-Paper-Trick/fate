'use client';

/* eslint-disable react-hooks/globals */
// Entry component
import { App } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { NotificationInstance } from 'antd/es/notification/interface';
import { memo } from 'react';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

const AntdStaticMethods = memo(() => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
  if (globalThis.window === undefined) {
    return;
  }
  // eslint-disable-next-line react-hooks/immutability
  globalThis.window.$message = message;
  // eslint-disable-next-line react-hooks/immutability
  globalThis.window.$modal = modal;
  // eslint-disable-next-line react-hooks/immutability
  globalThis.window.$notification = notification;
  return null;
});

export { message, modal, notification };

export default AntdStaticMethods;
