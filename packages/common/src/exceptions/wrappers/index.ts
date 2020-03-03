import HttpException from '../http-exception';
import { HttpStatus } from '../../constants';

class BadRequestException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.BAD_REQUEST, message, errors);
  }
}

class UnauthorizedException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.UNAUTHORIZED, message, errors);
  }
}

class ForbiddenException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.FORBIDDEN, message, errors);
  }
}

class NotFoundException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.NOT_FOUND, message, errors);
  }
}

class NotAcceptableException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.NOT_ACCEPTABLE, message, errors);
  }
}

class ConflictException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.CONFLICT, message, errors);
  }
}

class ValidationException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }
}

class InternalServerException extends HttpException {
  constructor(message = '', errors = {}) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, errors);
  }
}

export {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  NotAcceptableException,
  ConflictException,
  ValidationException,
  InternalServerException,
};
