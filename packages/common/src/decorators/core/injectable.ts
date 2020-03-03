import { Dictionary, InjectionToken, ctor } from '../../definitions/injector';
import {
  DESIGN_PARAM_TYPES,
  LEAP_PARAM_TYPES,
  LEAP_TAGGED_PARAMETERS,
} from '../../constants';
import { DUPLICATED_INJECTABLE_DECORATOR } from '../../resources/strings';

export function setCtorParams(target: ctor<any>): void {
  const params: any = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
  const injectionTokens: Dictionary<InjectionToken<any>> =
    Reflect.getOwnMetadata(LEAP_TAGGED_PARAMETERS, target) || {};
  const { length } = Object.keys(injectionTokens);
  for (let i = 0; i < length; i += 1) {
    params[i] = injectionTokens[i];
  }
}

function injectable() {
  return (target: any): any => {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
    }
    const types = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
    Reflect.defineMetadata(LEAP_PARAM_TYPES, types, target);
    setCtorParams(target);
    return target;
  };
}

export default injectable;
