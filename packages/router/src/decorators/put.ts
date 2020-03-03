import { addMethodMetadata } from '@leapjs/common';

function Put(route?: string) {
  return function wrapper(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    addMethodMetadata('put', target, propertyKey, descriptor, route || '/');
    return target;
  };
}

export default Put;
