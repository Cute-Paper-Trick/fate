export class ApiError extends Error {
  code: number;
  message: string;

  constructor(response: App.Service.Response) {
    super(response.msg || response.message);
    this.code = response.code;
    this.message = response.msg || response.message;
  }
}