import { DESIGN_PARAM_TYPES, LEAP_PARAM_TYPES } from '../../constants';
import { DUPLICATED_INJECTABLE_DECORATOR } from '../../resources/strings';
import { setCtorParams } from '../../utils/metadata';

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
