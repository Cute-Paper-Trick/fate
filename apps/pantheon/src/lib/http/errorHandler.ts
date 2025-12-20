'use client';

import { AxiosError } from 'axios';

import { message } from '@/components/AntdStaticMethods';

import { ApiError } from './error';

function onUnauthorized() {
  console.error('登录状态已过期，请重新登录');
  // eslint-disable-next-line unicorn/prefer-global-this
  if (typeof window !== 'undefined') {
    message?.error('登录状态已过期，请重新登录');
  }
}

const lastErrorTimeMap = new Map<string, number>();

export function apiErrorHandler(error: Error) {
  console.error('[API Error]', error);

  let code: number | undefined = undefined;
  if (error instanceof ApiError) {
    code = error.code;
  }
  if (error instanceof AxiosError) {
    code = error.status;
  }
  if (code) {
    const errorKey = `${code}:${error.message}`;
    const now = Date.now();
    const lastTime = lastErrorTimeMap.get(errorKey) || 0;
    if (now - lastTime < 1000) {
      // 1秒内重复异常，忽略
      console.warn('重复异常，忽略', errorKey);
      return;
    }
    lastErrorTimeMap.set(errorKey, now);
  }

  if (error instanceof AxiosError) {
    // eslint-disable-next-line eqeqeq
    if (error.status != null) {
      const msg = `${error.status} - ${error.message}`;
      message?.error(msg);

      if (error.status === 401) {
        onUnauthorized();
        return;
      }
    }
    return;
  }

  if (error instanceof ApiError) {
    if ([10_000, -401, -99].includes(error.code)) {
      onUnauthorized();
      return;
    }
    console.error(error.message || '请求出错');
    const msg = `${error.code} - ${error.message || '请求出错'}`;
    message?.error(msg);
  }
}
