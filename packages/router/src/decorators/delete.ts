import { addMethodMetadata } from '@leapjs/common';

function Delete(route?: string) {
  return function wrapper(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    addMethodMetadata('delete', target, propertyKey, descriptor, route || '/');
    return target;
  };
}

export default Delete;
