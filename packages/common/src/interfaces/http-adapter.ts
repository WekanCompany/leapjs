import { CorsOptions } from 'cors';
import { HTTP_METHODS } from '../definitions/router';
import { IConstructor } from './constructor';

export interface IHttpAdapter {
  create(options?: CorsOptions, whitelist?: string[]): any;
  listen(port: number, host: string): void;
  registerControllers(controllers: IConstructor<any>[]): void;
  registerRoutes(middlewares: IConstructor<any>[]): void;
  registerMethodParams(
    type: string,
    target: IConstructor<any>,
    methodName: string,
    index: number,
    name?: string,
  ): void;
  registerMethods(
    httpMethod: HTTP_METHODS,
    target: IConstructor<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
    route: string,
  ): any;
}
