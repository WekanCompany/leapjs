import express from 'express';
import { plainToClass } from 'class-transformer';
import multer from 'multer';
import {
  HTTP_METHODS,
  IHttpAdapter,
  Logger,
  LEAP_PARAM_TYPES,
  DESIGN_PARAM_TYPES,
  LEAP_ROUTER_CONTROLLER_METHODS,
  LEAP_ROUTER_MIDDLEWARE,
  ILeapContainer,
  IConstructor,
  isClass,
} from '@leapjs/common';
import { ParamsDictionary } from 'express-serve-static-core';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import ServerRegistry from '../../registry';

import {
  CLASS_NOT_FOUND,
  PARAM_TYPE_METADATA_NOT_FOUND,
  INVALID_BEFORE_MIDDLEWARE_CLASS,
  INVALID_AFTER_MIDDLEWARE_CLASS,
} from '../../resources/strings';
import { IController } from '../../interfaces/controller';
import { IAttributes } from '../../interfaces/attributes';
import { IMethodParams } from '../../interfaces/method-params';
import Cors from './middleware/cors';

// TODO refactor
class ExpressAdapter implements IHttpAdapter {
  private app: express.Express;
  private registry = new ServerRegistry();
  private container!: ILeapContainer;
  private prefix!: string;
  private globalBeforeMiddlewares: any = [];
  private globalAfterMiddlewares: any = [];
  private logger = Logger.getInstance();

  public init(container: ILeapContainer, prefix = ''): void {
    this.container = container;
    this.prefix = prefix;
  }

  private buildRoute(base: string, resourceRoute: string): string {
    return `/${this.prefix}/${base}/${resourceRoute}`.replace(/\/+/g, '/');
  }

  public create(
    options?: CorsOptions,
    whitelist?: string[],
    parserOptions?: {
      json: bodyParser.OptionsJson;
      urlencoded: bodyParser.OptionsUrlencoded;
    },
  ): express.Express {
    this.app = express();
    this.bodyParser(parserOptions);
    this.cookieParser();
    if (options === undefined && whitelist === undefined) {
      this.logger.warn('No domains provided for cors origin filter', 'Router');
    }
    this.cors(options, whitelist || ['http://localhost']);
    return this.app;
  }

  public bodyParser(parserOptions?: {
    json: bodyParser.OptionsJson;
    urlencoded: bodyParser.OptionsUrlencoded;
  }): void {
    let jsonOptions: bodyParser.OptionsJson = { limit: '100kb' };
    let urlencodedOptions: bodyParser.OptionsUrlencoded = {
      limit: '100kb',
      extended: true,
    };
    if (parserOptions) {
      if (parserOptions.json) {
        jsonOptions = parserOptions.json;
      }
      if (parserOptions.urlencoded) {
        urlencodedOptions = parserOptions.urlencoded;
      }
    }
    this.app.use(express.json(jsonOptions));
    this.app.use(express.urlencoded(urlencodedOptions));
  }

  public cookieParser(): void {
    this.app.use(cookieParser());
  }

  public cors(options: any, whielist: string[]): void {
    Cors.setWhitelist(whielist);
    this.app.use(
      cors(options || { origin: Cors.corsOriginFilter, credentials: true }),
    );
  }

  public listen(port: number, host = 'localhost'): void {
    this.app.listen(port, host);
  }

  public registerControllers(controllers: IConstructor<any>[]): void {
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

  public registerGlobalMiddlewares(
    globalBeforeMiddlewares: IConstructor<any>[],
    globalAfterMiddlewares: IConstructor<any>[],
  ): void {
    this.globalBeforeMiddlewares.push(
      ...globalBeforeMiddlewares.map((middleware: any) => {
        let source = middleware;
        if (isClass(source)) {
          if ('before' in source.prototype) {
            source = this.container.resolve(middleware.prototype.constructor);
            source = source.before.bind(source);
          } else {
            throw new Error(
              `${source.prototype.constructor.name} ${INVALID_BEFORE_MIDDLEWARE_CLASS}`,
            );
          }
        }
        return source;
      }),
    );
    this.globalAfterMiddlewares.push(
      ...globalAfterMiddlewares.map((middleware: any) => {
        let source = middleware;
        if (isClass(source)) {
          if ('after' in source.prototype) {
            source = this.container.resolve(middleware.prototype.constructor);
            source = source.after.bind(source);
          } else {
            throw new Error(
              `${source.prototype.constructor.name} ${INVALID_AFTER_MIDDLEWARE_CLASS}`,
            );
          }
        }
        return source;
      }),
    );
  }

  public registerMiddlewares(
    controllerMiddleware: any,
  ): { before: any; after: any } {
    const beforeMiddlewares: any = [];
    const afterMiddlewares: any = [];

    beforeMiddlewares.push(
      ...controllerMiddleware
        .filter((middleware: { type: string }) => middleware.type === 'before')
        .map((middleware: any) => {
          let { source } = middleware;
          if (isClass(source)) {
            if ('before' in source.prototype) {
              source = this.container.resolve(source.prototype.constructor);
              source = source.before.bind(source);
            } else {
              throw new Error(
                `${source.prototype.constructor.name} ${INVALID_BEFORE_MIDDLEWARE_CLASS}`,
              );
            }
          }
          return source;
        }),
    );
    afterMiddlewares.push(
      ...controllerMiddleware
        .filter((middleware: { type: string }) => middleware.type === 'after')
        .map((middleware: any) => {
          let { source } = middleware;
          if (isClass(source)) {
            if ('after' in source.prototype) {
              source = this.container.resolve(source.prototype.constructor);
              source = source.after.bind(source);
            } else {
              throw new Error(
                `${source.prototype.constructor.name} ${INVALID_AFTER_MIDDLEWARE_CLASS}`,
              );
            }
          }
          return source;
        }),
    );

    return { before: beforeMiddlewares, after: afterMiddlewares };
  }

  public registerRoutes(): void {
    this.registry.controllers.forEach((controller: IController) => {
      if (controller.attributes) {
        let beforeControllerMiddlewares: any = [];
        let afterControllerMiddlewares: any = [];

        const controllerMiddleware = Reflect.getMetadata(
          LEAP_ROUTER_MIDDLEWARE,
          controller.class,
        );

        if (controllerMiddleware) {
          const { before, after } = this.registerMiddlewares(
            controllerMiddleware,
          );
          beforeControllerMiddlewares = before;
          afterControllerMiddlewares = after;
        }

        controller.attributes.forEach((attribute: IAttributes) => {
          let beforeMethodMiddlewares: any = [];
          let afterMethodMiddlewares: any = [];

          const kontroller: any = controller;

          if (kontroller.class.prototype !== undefined) {
            kontroller.class = this.container.resolve<typeof controller.class>(
              controller.class.prototype.constructor,
            );
          }

          const controllerMethodMiddleware = Reflect.getMetadata(
            LEAP_ROUTER_MIDDLEWARE,
            controller.class,
            attribute.method.name,
          );

          if (controllerMethodMiddleware) {
            const { before, after } = this.registerMiddlewares(
              controllerMethodMiddleware,
            );
            beforeMethodMiddlewares = before;
            afterMethodMiddlewares = after;
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
              params[attribute.methodParams.param[j].index] =
                request.params[attribute.methodParams.param[j].name];
            }

            for (j = 0; j < attribute.methodParams.request.length; j += 1) {
              params[attribute.methodParams.request[j].index] = request;
            }

            for (j = 0; j < attribute.methodParams.response.length; j += 1) {
              params[attribute.methodParams.response[j].index] = response;
            }

            for (j = 0; j < attribute.methodParams.body.length; j += 1) {
              params[attribute.methodParams.body[j].index] = plainToClass(
                attribute.methodParams.body[j].type as any,
                request.body,
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

            return controller.class[registeredClass.method.name](...params)
              .then((result: any) => {
                if (!response.headersSent) {
                  const req: any = request;
                  req.result = result;
                  // eslint-disable-next-line no-param-reassign
                  request = req;
                  return next();
                }
              })
              .catch((error: any) => next(error));
          }

          const route = `${controller.class.name}_${attribute.method.name}`;

          if (this.registry.middlewares.has(route)) {
            beforeMethodMiddlewares.push(this.registry.middlewares.get(route));
          }

          // Register route
          this.app[attribute.httpMethod](
            this.buildRoute(controller.baseRoute, `/${attribute.route}`),
            ...this.globalBeforeMiddlewares,
            ...beforeControllerMiddlewares,
            ...beforeMethodMiddlewares,
            routeHandler,
            ...afterMethodMiddlewares,
            ...afterControllerMiddlewares,
            ...this.globalAfterMiddlewares,
          );
        });
      }
    });
  }

  public registerMethodParams(
    type: string,
    target: IConstructor<any>,
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
      `${target.constructor.name}${methodName}`,
      methodParams,
    );
  }

  public registerMethods(
    httpMethod: HTTP_METHODS,
    target: IConstructor<any>,
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
      `${target.constructor.name}${propertyKey}`,
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
