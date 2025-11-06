import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { axiosInstance } from './axiosClient';

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  baseURL?: string;
  url?: string;
  method?: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD';
  params?: unknown;
  data?: TData | FormData;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
  signal?: AbortSignal;
  validateStatus?: (status: number) => boolean;
  headers?: AxiosRequestConfig['headers'];
};

/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers: AxiosResponse['headers'];
};

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>;

export const client = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  // const globalConfig = getConfig()

  return axiosInstance
    .request<TData, ResponseConfig<TData>>({
      // ...globalConfig,
      ...config,
      headers: {
        // ...globalConfig.headers,
        ...config.headers,
      },
    })
    .catch((error: AxiosError<TError>) => {
      throw error;
    });
};

// client.getConfig = getConfig
// client.setConfig = setConfig

export default client;
