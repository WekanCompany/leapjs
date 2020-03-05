import mongoose from 'mongoose';
import {
  ConflictException,
  ValidationException,
} from '../../../exceptions/wrappers';

function checkErrors(
  error: any,
  model: string,
): ConflictException | ValidationException | boolean {
  if (error.name === 'MongoError' && error.code === 11000) {
    return new ConflictException(`${model} already exists`);
  }

  if (error.name === 'ValidationError') {
    return new ValidationException(
      `Please provide valid data for ${
        error.errors[Object.keys(error.errors)[0]].path
      }`,
    );
  }

  if (error.name === 'CastError') {
    return new ValidationException(
      `Please provide a valid ${String(error.kind).toLowerCase()} value for ${
        error.path
      }`,
    );
  }

  return false;
}

function mongoErrorHandler(model: string): any {
  return (
    error: any,
    doc: mongoose.Document,
    next: (err?: mongoose.NativeError) => void,
  ): void => {
    const result = checkErrors(error, model);

    if (typeof result !== 'boolean') {
      return next(result);
    }
    return next();
  };
}

export default mongoErrorHandler;
