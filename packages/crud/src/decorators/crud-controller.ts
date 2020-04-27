import {
  LEAP_PARAM_TYPES,
  IConstructor,
  InternalServerException,
  DESIGN_PARAM_TYPES,
} from '@leapjs/common';
import { DUPLICATED_ROUTABLE_DECORATOR } from '../resources/strings';
import { ICrudControllerOptions } from '../interfaces/crud-controller';
import { addMethodMiddleware, addRoute } from '../utils/metadata';
import crudMethodParams from '../constants';

function CrudController(options: ICrudControllerOptions): Function {
  return function wrapper(target: IConstructor<any>): void {
    if (Reflect.hasOwnMetadata(LEAP_PARAM_TYPES, target)) {
      throw new Error(DUPLICATED_ROUTABLE_DECORATOR);
    }

    if (options.methods) {
      Object.entries(options.methods).forEach((method: any) => {
        if (method[1] !== false) {
          const methodData = crudMethodParams.get(method[0]);
          if (!methodData) {
            throw new InternalServerException(
              'CRUD method parameter map not populated',
            );
          }
          const metadata = Reflect.getMetadata(
            DESIGN_PARAM_TYPES,
            target.prototype,
            method[0],
          );
          if (metadata === undefined) {
            if (method[1].length === 2) {
              if ('before' in method[1][1]) {
                for (let i = 0; i < method[1][1].before.length; i += 1) {
                  addMethodMiddleware(
                    target,
                    method[0],
                    'before',
                    method[1][1].before[i],
                  );
                }
              }
              if ('after' in method[1][1]) {
                for (let i = 0; i < method[1][1].after.length; i += 1) {
                  addMethodMiddleware(
                    target,
                    method[0],
                    'after',
                    method[1][1].after[i],
                  );
                }
              }
            }
            addRoute(
              methodData[0],
              options.model,
              target,
              method[0],
              method[1][0],
              [...methodData[1]],
            );
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
