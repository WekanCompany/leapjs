import { LEAP_PARAM_TYPES } from '@leapjs/common';
import { DUPLICATED_ROUTABLE_DECORATOR } from '../resources/strings';

function Middleware(): Function {
  return function wrapper(target: Function): void {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error(DUPLICATED_ROUTABLE_DECORATOR);
    }
    Reflect.defineMetadata(LEAP_PARAM_TYPES, { middleware: target }, target);
  };
}

export default Middleware;
