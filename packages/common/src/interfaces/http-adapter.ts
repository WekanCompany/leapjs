import express from 'express';
import { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import { ILeapContainer } from './container';
import { IConstructor } from './constructor';
import { HTTP_METHODS } from '../definitions/router';

export interface IHttpAdapter {
  init(container: ILeapContainer, prefix: string): void;
  create(
    options?: CorsOptions,
    whitelist?: string[],
    parserOptions?: {
      json: bodyParser.OptionsJson;
      urlencoded: bodyParser.OptionsUrlencoded;
    },
  ): express.Express;
  listen(port: number, host: string): void;
  registerControllers(controllers: IConstructor<any>[]): void;
  registerGlobalMiddlewares(
    globalBeforeMiddlewares: IConstructor<any>[],
    globalAfterMiddlewares: IConstructor<any>[],
  ): void;
  registerRoutes(): void;
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
