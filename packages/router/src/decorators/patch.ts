import { addMethodMetadata } from '@leapjs/common';

function Patch(route?: string) {
  return function wrapper(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    addMethodMetadata('patch', target, propertyKey, descriptor, route || '/');
    return target;
  };
}

export default Patch;
