import { addMethodMetadata } from '@leapjs/common';

function Get(route?: string) {
  return function wrapper(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    addMethodMetadata('get', target, propertyKey, descriptor, route || '/');
    return target;
  };
}

export default Get;
