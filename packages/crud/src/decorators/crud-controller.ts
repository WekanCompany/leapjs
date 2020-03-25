import {
  LEAP_PARAM_TYPES,
  IConstructor,
  LEAP_ROUTER_CONTROLLER_METHODS,
  InternalServerException,
} from '@leapjs/common';
import { ICrudControllerOptions } from '../interfaces/crud-controller';
import { addMethodMiddleware, addRoute } from '../utils/metadata';
import crudMethods from '../constants';

function CrudController(options: ICrudControllerOptions): Function {
  return function wrapper(target: IConstructor<any>): void {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error('DUPLICATED_ROUTABLE_DECORATOR');
    }

    if (options.methods) {
      Object.entries(options.methods).forEach((method: any) => {
        if (method[1] !== false) {
          const methodData = crudMethods.get(method[0]);
          if (!methodData) {
            throw new InternalServerException(
              'CRUD method parameter map not populated',
            );
          }
          const metadata = Reflect.getMetadata(
            LEAP_ROUTER_CONTROLLER_METHODS,
            target.prototype,
            method[0],
          );
          if (
            metadata &&
            'propertyKey' in metadata[0] &&
            metadata[0].propertyKey !== method[0]
          ) {
            for (let i = 0; i < method[1][1].before.length; i += 1) {
              addMethodMiddleware(
                target,
                method[0],
                'before',
                method[1][1].before[i],
              );
            }
            for (let i = 0; i < method[1][1].after.length; i += 1) {
              addMethodMiddleware(
                target,
                method[0],
                'after',
                method[1][1].before[i],
              );
            }
            addRoute(methodData[0], target, method[0], '', [...methodData[1]]);
          }
        }
      });
    }

    Reflect.defineMetadata(
      LEAP_PARAM_TYPES,
      { baseRoute: options.baseRoute },
      target,
    );
  };
}

export default CrudController;
