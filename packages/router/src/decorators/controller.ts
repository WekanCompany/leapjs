import { LEAP_PARAM_TYPES } from '@leapjs/common';
import { DUPLICATED_ROUTABLE_DECORATOR } from '../resources/strings';

function Controller(resourceBaseRoute: string): Function {
  return function wrapper(target: Function): void {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error(DUPLICATED_ROUTABLE_DECORATOR);
    }
    Reflect.defineMetadata(
      LEAP_PARAM_TYPES,
      { baseRoute: resourceBaseRoute },
      target,
    );
  };
}

export default Controller;
