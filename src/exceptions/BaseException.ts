class BaseError extends Error {
  public code: number;
  public status: number;
  public data: {};

  constructor(properties: { message: string; status: number; data: {}; code: number }) {
    const { message = 'Error', status = 400, code = 0, data = {} } = properties;
    super(message);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export default BaseError;
