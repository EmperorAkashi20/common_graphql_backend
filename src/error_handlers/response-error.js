export default class ResponseError {
  constructor(error, statusCode, errorCodeForClient) {
    this.error = error;
    this.statusCode = statusCode;
    this.errorCodeForClient = errorCodeForClient;
  }
}