/** The global namespace for the app */
declare namespace App {
  /** Global namespace */
  /** Service namespace */
  namespace Service {
    interface File {
      url: string;
      fileName: string;
    }

    interface ServiceConfigItem {
      /** The backend service base url */
      baseURL: string;
      /** The proxy pattern of the backend service base url */
      proxyPattern: string;
    }

    /** 服务器返回的 option 类型 */
    type Option<Id = number | string, Val = string> = { id: Id; val: Val };

    /** The backend service response data */
    type Response<T = unknown> = {
      /** The backend service response code */
      code: number;
      /** The backend service response data */
      data: T;
      /** The backend service response message */
      message: string;
      msg?: string;
      /** The backend service track id */
      traceId: string;
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type ListParams<T extends object = {}> = T & {
      page: number;
      size: number;
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type ListResponse<TData = unknown, T extends object = {}> = {
      list: TData[];
      total: number;
      page: number;
      size: number;
    } & T;
  }
}
