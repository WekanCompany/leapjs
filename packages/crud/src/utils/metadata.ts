import {
  addMethodMetadata,
  addMethodParamsMetadata,
  LEAP_ROUTER_MIDDLEWARE,
  IConstructor,
  IRouteMetadata,
  DESIGN_PARAM_TYPES,
} from '@leapjs/common';

function addMethodMiddleware(
  target: IConstructor<any>,
  methodName: string,
  type: string,
  middleware: Function,
): void {
  const existingMetadata: any = [];
  const klass = methodName ? target.prototype[methodName] : target.prototype;
  const middlewares = Reflect.getMetadata(
    LEAP_ROUTER_MIDDLEWARE,
    target.prototype,
    methodName,
  );
  if (middlewares) {
    existingMetadata.push(...middlewares);
  }
  existingMetadata.push({
    source: middleware,
    type,
    target: klass,
  });
  Reflect.defineMetadata(
    LEAP_ROUTER_MIDDLEWARE,
    existingMetadata,
    target.prototype,
    methodName,
  );
}

function addRoute(
  method: string,
  model: IConstructor<any>,
  target: IConstructor<any>,
  methodName: string,
  route: string,
  params: [string, string][],
): void {
  const metadata: IConstructor<any>[] = [];
  for (let i = 0; i < params.length; i += 1) {
    metadata[i] = model;
    addMethodParamsMetadata(
      params[i][0],
      target.prototype,
      methodName,
      i,
      params[i][1],
    );
  }
  Reflect.defineMetadata(
    DESIGN_PARAM_TYPES,
    metadata,
    target.prototype,
    methodName,
  );
  addMethodMetadata(
    method,
    target.prototype,
    methodName,
    {
      value: target.prototype[methodName],
      writable: true,
      enumerable: false,
      configurable: true,
    } as PropertyDescriptor,
    route || '/',
  );
}

export { addRoute, addMethodMiddleware };
