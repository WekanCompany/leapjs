import { LEAP_ROUTER_MIDDLEWARE } from '@leapjs/common';

function UseAfter(middleware: Function): Function {
  return function wrapper(target: Function, method: any): void {
    const existingMetadata: any = [];
    const klass = method ? target[method] : target;
    const middlewares = Reflect.getMetadata(
      LEAP_ROUTER_MIDDLEWARE,
      target,
      method,
    );
    if (middlewares) {
      existingMetadata.push(...middlewares);
    }
    existingMetadata.push({
      source: middleware,
      type: 'after',
      target: klass,
    });
    Reflect.defineMetadata(
      LEAP_ROUTER_MIDDLEWARE,
      existingMetadata,
      target,
      method,
    );
  };
}

export default UseAfter;
