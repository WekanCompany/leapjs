import { addMethodMetadata } from '@leapjs/common';

function Post(route?: string) {
  return function wrapper(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    addMethodMetadata('post', target, propertyKey, descriptor, route || '/');
    return target;
  };
}

export default Post;
