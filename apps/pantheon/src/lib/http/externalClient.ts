import Axios, { AxiosResponse } from "axios";

import { ApiError } from "./error";
import { apiErrorHandler } from "./errorHandler";

export type RequestConfig<TData = unknown> = {
  url?: string
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'
  params?: object
  data?: TData | FormData
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  signal?: AbortSignal
  headers?: HeadersInit
}

export type ResponseConfig<TData = unknown> = {
  data: TData
  status: number
  statusText: string
}

const client = Axios.create({
  baseURL: '/external',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 确保携带 cookie 和正确的 headers
client.interceptors.request.use(
  (config) => {
    // 强制设置 withCredentials
    config.withCredentials = true;

    // 确保 Content-Type 设置正确
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 对服务器响应 去掉一层公共结构 App.Service.Response
client.interceptors.response.use(
  async (response: AxiosResponse<App.Service.Response<any>>) => {
    if (response.data.code !== 0) {
      const apiError = new ApiError(response.data);
      apiErrorHandler(apiError);
      throw apiError;
      // return Promise.reject(apiError);
    }
    response.data = response.data.data;
    return response;
  },
);


export default client;