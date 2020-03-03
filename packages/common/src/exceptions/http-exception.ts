import { HttpStatus } from '../constants';

class HttpException extends Error {
  public message = '';
  public errors = {};
  public status: number;

  constructor(
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    errors = {},
  ) {
    super();
    this.message = message;
    if (Object.keys(errors).length) {
      this.errors = errors;
    }
    this.message = message;
    this.status = status;
  }
}

export default HttpException;
