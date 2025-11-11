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

export default memo(() => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
  // eslint-disable-next-line react-hooks/immutability, unicorn/prefer-global-this
  window.$message = message;
  // eslint-disable-next-line react-hooks/immutability, unicorn/prefer-global-this
  window.$modal = modal;
  // eslint-disable-next-line react-hooks/immutability, unicorn/prefer-global-this
  window.$notification = notification;
  return null;
});

export { message, modal, notification };
