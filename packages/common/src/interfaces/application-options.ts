import { CorsOptions } from 'cors';
import { IConstructor } from './constructor';

export interface ILeapApplicationOptions {
  classTransformer?: boolean;
  validation?: boolean;
  defaultErrorHandler?: boolean;
  corsOptions?: CorsOptions;
  whitelist?: string[];
  controllers: IConstructor<any>[];
  middlewares?: IConstructor<any>[];
}
