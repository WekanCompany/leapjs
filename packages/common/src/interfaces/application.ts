import { CorsOptions } from 'cors';
import { HTTP_METHODS } from '../definitions/router';
import { IType } from './type';

export interface IHttpAdapter {
  create(options?: CorsOptions, whitelist?: string[]): any;
  listen(port: number, host: string): void;
  registerControllers(controllers: IType<any>[]): void;
  registerRoutes(middlewares: IType<any>[]): void;
  registerMethodParams(
    type: string,
    target: IType<any>,
    methodName: string,
    index: number,
    name?: string,
  ): void;
  registerMethods(
    httpMethod: HTTP_METHODS,
    target: IType<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
    route: string,
  ): any;
}
