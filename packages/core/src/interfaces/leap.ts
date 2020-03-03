import { IType } from '@leapjs/common';
import { CorsOptions } from 'cors';

export interface IServerOptions {
  classTransformer?: boolean;
  validation?: boolean;
  defaultErrorHandler?: boolean;
  corsOptions?: CorsOptions;
  whitelist?: string[];
  controllers: IType<any>[];
  middlewares?: IType<any>[];
}
