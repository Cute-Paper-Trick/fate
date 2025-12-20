import axios, { AxiosResponse } from 'axios';

import { ApiError } from './error';
import { apiErrorHandler } from './errorHandler';

// declare const AXIOS_BASE: string
// declare const AXIOS_HEADERS: string

// let _config: Partial<RequestConfig> = {
//   baseURL: AXIOS_BASE !== undefined ? AXIOS_BASE : undefined,
//   headers: AXIOS_HEADERS !== undefined ? (JSON.parse(AXIOS_HEADERS) as AxiosHeaders) : undefined,
// }

// export const getConfig = () => _config

// export const setConfig = (config: RequestConfig) => {
//   _config = config
//   return getConfig()
// }

export const axiosInstance = axios.create({
  baseURL: '/external',
  withCredentials: true,
});

// 请求拦截器 - 确保携带 cookie 和正确的 headers
axiosInstance.interceptors.request.use(
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
  },
);

// 对服务器响应 去掉一层公共结构 App.Service.Response
axiosInstance.interceptors.response.use(
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
