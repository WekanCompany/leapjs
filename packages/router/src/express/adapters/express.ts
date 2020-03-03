import express from 'express';
import { plainToClass } from 'class-transformer';
import multer from 'multer';
import {
  IAttributes,
  IController,
  IMethodParams,
  IType,
  HTTP_METHODS,
  IHttpAdapter,
  Logger,
  LEAP_PARAM_TYPES,
  DESIGN_PARAM_TYPES,
  LEAP_ROUTER_CONTROLLER_METHODS,
  LEAP_ROUTER_MIDDLEWARE,
} from '@leapjs/common';
import { ParamsDictionary } from 'express-serve-static-core';
import cookieParser from 'cookie-parser';
import { container } from '@leapjs/core';
import { CorsOptions } from 'cors';
import ServerRegistry from '../../registry';
import Cors from '../cors';
import {
  CLASS_NOT_FOUND,
  PARAM_TYPE_METADATA_NOT_FOUND,
} from '../../resources/strings';

// TODO refactor
class ExpressAdapter implements IHttpAdapter {
  private app: express.Express;
  private registry = new ServerRegistry();
  private prefix = '';

  private buildRoute(base: string, resourceRoute: string): string {
    return `${base}${resourceRoute}`.replace('//', '/');
  }

  public create(options?: CorsOptions, whitelist?: string[]): express.Express {
    this.app = express();
    this.bodyParser();
    this.cookieParser();
    if (options === undefined && whitelist === undefined) {
      Logger.warn('No domains provided for cors origin filter', 'Router');
    }
    this.cors(new Cors(options, whitelist));
    return this.app;
  }

  public bodyParser(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public cookieParser(): void {
    this.app.use(cookieParser());
  }

  public cors(cors: Cors): void {
    cors.cors(this.app);
  }

  public listen(port: number, host = 'localhost'): void {
    this.app.listen(port, host);
  }

  public registerControllers(controllers: IType<any>[]): void {
    controllers.forEach((controller: Function) => {
      const methodsMetadata =
        Reflect.getMetadata(
          LEAP_ROUTER_CONTROLLER_METHODS,
          controller.prototype,
        ) || {};
      const methodParamsMetadata = Reflect.getMetadata(
        LEAP_PARAM_TYPES,
        controller.prototype,
      );
      Object.values(methodParamsMetadata).forEach((methodParam: any) => {
        this.registerMethodParams(
          methodParam.type,
          methodParam.target,
          methodParam.methodName,
          methodParam.index,
          methodParam.name,
          methodParam.options,
        );
      });
      Object.values(methodsMetadata).forEach((route: any) => {
        this.registerMethods(
          route.method,
          route.target,
          route.propertyKey,
          route.descriptor,
          route.route,
        );
      });

      this.registry.controllers.set(controller.prototype, {
        class: controller,
        baseRoute:
          Reflect.getMetadata(LEAP_PARAM_TYPES, controller).baseRoute || '/',
        attributes: this.registry.attributes.get(controller.prototype) || [],
      });
    });
  }

  // TODO move middleware mapping to mapMiddlewares()
  public registerRoutes(middlewares: IType<any>[]): void {
    const globalBeforeMiddlewares: any = [];
    const globalAfterMiddlewares: any = [];
    globalBeforeMiddlewares.push(
      ...middlewares
        .filter(
          (middleware: { prototype: any }) => 'before' in middleware.prototype,
        )
        .map((middleware: IType<any>) => middleware.prototype.before),
    );
    globalAfterMiddlewares.push(
      ...middlewares
        .filter(
          (middleware: { prototype: any }) => 'after' in middleware.prototype,
        )
        .map((middleware: IType<any>) => middleware.prototype.after),
    );
    this.registry.controllers.forEach((controller: IController) => {
      if (controller.attributes) {
        const beforeMiddlewares: any = [];
        const afterMiddlewares: any = [];

        const controllerMiddleware = Reflect.getMetadata(
          LEAP_ROUTER_MIDDLEWARE,
          controller.class,
        );

        if (controllerMiddleware) {
          beforeMiddlewares.push(
            ...controllerMiddleware
              .filter(
                (middleware: { type: string }) => middleware.type === 'before',
              )
              .map(({ middleware }) => middleware),
          );
          afterMiddlewares.push(
            ...controllerMiddleware
              .filter(
                (middleware: { type: string }) => middleware.type === 'after',
              )
              .map(({ middleware }) => middleware),
          );
        }

        controller.attributes.forEach((attribute: IAttributes) => {
          const controllerMethodMiddleware = Reflect.getMetadata(
            LEAP_ROUTER_MIDDLEWARE,
            attribute.method,
          );

          if (controllerMethodMiddleware) {
            beforeMiddlewares.push(
              ...controllerMethodMiddleware
                .filter(
                  (middleware: { type: string }) =>
                    middleware.type === 'before',
                )
                .map(({ middleware }) => middleware),
            );
            afterMiddlewares.push(
              ...controllerMethodMiddleware
                .filter(
                  (middleware: { type: string }) => middleware.type === 'after',
                )
                .map(({ middleware }) => middleware),
            );
          }

          const kontroller: any = controller;

          if (kontroller.class.prototype !== undefined) {
            kontroller.class = container.resolve<typeof controller.class>(
              controller.class.prototype.constructor,
            );
          }

          function routeHandler(
            request: express.Request,
            response: express.Response,
            next: Function,
          ): void {
            const registeredClass = kontroller.attributes.find(
              (obj: IAttributes) => {
                return obj.method === attribute.method;
              },
            );
            if (registeredClass === undefined) {
              throw new Error(CLASS_NOT_FOUND);
            }
            const params: any = [];
            let j = 0;
            for (; j < attribute.methodParams.query.length; j += 1) {
              params[attribute.methodParams.query[j].index] =
                request.query[attribute.methodParams.query[j].name];
            }

            for (j = 0; j < attribute.methodParams.param.length; j += 1) {
              params[attribute.methodParams.query[j].index] =
                request.param[attribute.methodParams.param[j].name];
            }

            for (j = 0; j < attribute.methodParams.request.length; j += 1) {
              params[attribute.methodParams.request[j].index] = request;
            }

            for (j = 0; j < attribute.methodParams.response.length; j += 1) {
              params[attribute.methodParams.response[j].index] = response;
            }

            for (j = 0; j < attribute.methodParams.body.length; j += 1) {
              params[
                attribute.methodParams.body[j].index
              ] = plainToClass(
                attribute.methodParams.body[j].type as any,
                request.body,
                { excludeExtraneousValues: true },
              );
            }

            for (j = 0; j < attribute.methodParams.cookie.length; j += 1) {
              params[attribute.methodParams.cookie[j].index] =
                request.cookies[attribute.methodParams.cookie[j].name];
            }

            for (j = 0; j < attribute.methodParams.cookies.length; j += 1) {
              params[attribute.methodParams.cookies[j].index] = request.cookies;
            }

            for (j = 0; j < attribute.methodParams.header.length; j += 1) {
              params[attribute.methodParams.header[j].index] =
                request.headers[attribute.methodParams.header[j].name];
            }

            for (j = 0; j < attribute.methodParams.headers.length; j += 1) {
              params[attribute.methodParams.headers[j].index] = request.headers;
            }

            for (j = 0; j < attribute.methodParams.file.length; j += 1) {
              params[attribute.methodParams.file[j].index] = request.file;
            }

            for (j = 0; j < attribute.methodParams.files.length; j += 1) {
              params[attribute.methodParams.files[j].index] = request.files;
            }

            next(controller.class[registeredClass.method.name](...params));
          }

          const route = `${controller.class.name}_${attribute.method.name}`;

          if (this.registry.middlewares.has(route)) {
            beforeMiddlewares.push(this.registry.middlewares.get(route));
          }

          // Register route
          this.app[attribute.httpMethod](
            this.buildRoute(controller.baseRoute, `/${attribute.route}`),
            ...globalBeforeMiddlewares,
            ...beforeMiddlewares,
            routeHandler,
            ...afterMiddlewares,
            ...globalAfterMiddlewares,
          );
        });
      }
    });
  }

  public registerMethodParams(
    type: string,
    target: IType<any>,
    methodName: string,
    index: number,
    name = '',
    options?: any,
  ): void {
    const existingMethodParams:
      | IMethodParams
      | undefined = this.registry.methodParams.get(
      `${target.constructor.name}${methodName}`,
    );
    const methodParams: IMethodParams = {
      query: [],
      request: [],
      response: [],
      param: [],
      body: [],
      file: [],
      files: [],
      cookie: [],
      cookies: [],
      header: [],
      headers: [],
    };
    if (type === 'file' || type === 'files') {
      let upload: express.RequestHandler<ParamsDictionary>;
      if (name === '') {
        upload = multer(options.options).fields(options.fields);
      } else {
        upload = multer(options.options).fields([
          { name, maxCount: options.maxCount },
        ]);
      }

      this.registry.middlewares.set(
        `${target.constructor.name}_${methodName}`,
        upload,
      );
    }

    if (existingMethodParams) {
      Object.keys(existingMethodParams).forEach((param) => {
        if (param in existingMethodParams) {
          methodParams[param].push(...existingMethodParams[param]);
        }
      });
    }

    const paramTypes: any = Reflect.getMetadata(
      DESIGN_PARAM_TYPES,
      target,
      methodName,
    );

    if (!paramTypes) {
      throw new Error(PARAM_TYPE_METADATA_NOT_FOUND);
    }

    methodParams[type].push({
      name,
      index,
      type: paramTypes[index],
    });

    this.registry.methodParams.set(
      target.constructor.name + methodName,
      methodParams,
    );
  }

  public registerMethods(
    httpMethod: HTTP_METHODS,
    target: IType<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
    route: string,
  ): any {
    const attributes = [] as IAttributes[];
    if (this.registry.attributes.has(target)) {
      const meta: IAttributes[] | undefined = this.registry.attributes.get(
        target,
      );
      if (meta) {
        attributes.push(...meta);
      }
    }
    let params: IMethodParams | undefined = this.registry.methodParams.get(
      target.constructor.name + propertyKey,
    );
    if (params === undefined) {
      params = {} as IMethodParams;
    }
    attributes.push({
      httpMethod,
      route,
      method: descriptor.value,
      methodParams: params,
    });
    this.registry.attributes.set(target, attributes);
    return target;
  }
}

export default ExpressAdapter;
