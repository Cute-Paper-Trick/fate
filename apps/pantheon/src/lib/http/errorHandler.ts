import { AxiosError } from "axios";

import { ApiError } from "./error";

function onUnauthorized(error: Error) {
  console.error("登录状态已过期，请重新登录", error);
  // eslint-disable-next-line unicorn/prefer-global-this
  if (typeof window !== 'undefined') {
    globalThis.$message?.error("登录状态已过期，请重新登录");
  }
  // localStg.remove("token");
  // window.$navigate({ to: "/login" });
  // setTimeout(() => window.location.reload(), 100);

}

const lastErrorTimeMap = new Map<string, number>();

export function apiErrorHandler(error: Error) {
  if (error instanceof AxiosError) {
    if (error.status === 401) {
      onUnauthorized(error);
      return;
    }

if (error instanceof ApiError) {
    // 以 code+message 作为唯一标识
    const errorKey = `${error.code}:${error.message}`;
    const now = Date.now();
    const lastTime = lastErrorTimeMap.get(errorKey) || 0;
    if (now - lastTime < 3000) {
      // 1秒内重复异常，忽略
      console.warn("重复异常，忽略", errorKey);
      return;
    }

    lastErrorTimeMap.set(errorKey, now);

    if ([10_000, -401, -99].includes(error.code)) {
      onUnauthorized(error);
      return;
    }

    if (error.message === "session id not has ctrl") {
      return;
    }

    console.error(error.message || "请求出错");
    // eslint-disable-next-line unicorn/prefer-global-this
    if (typeof window !== 'undefined') {
      globalThis.$message?.error(error.message || "请求出错");
    }
  }
  }
}



