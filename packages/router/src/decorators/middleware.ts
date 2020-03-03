import { LEAP_PARAM_TYPES } from '@leapjs/common';

function Middleware(): Function {
  return function wrapper(target: Function): void {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error('ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR');
    }
    Reflect.defineMetadata(LEAP_PARAM_TYPES, { middleware: target }, target);
  };
}

export default Middleware;
