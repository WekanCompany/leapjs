import { LEAP_PARAM_TYPES } from '@leapjs/common';

function Controller(resourceBaseRoute: string): Function {
  return function wrapper(target: Function): void {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error('ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR');
    }
    Reflect.defineMetadata(
      LEAP_PARAM_TYPES,
      { baseRoute: resourceBaseRoute },
      target,
    );
  };
}

export default Controller;
