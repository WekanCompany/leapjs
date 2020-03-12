import { CorsOptions } from 'cors';
// import { ILeapContainer } from './container';
import { IConstructor } from './constructor';

export interface ILeapApplicationOptions {
  controllers: IConstructor<any>[];
  beforeMiddlewares?: any;
  afterMiddlewares?: any;
  prefix?: string;
  corsOptions?: CorsOptions;
  whitelist?: string[];
  // classTransformer?: boolean;
  // validation?: boolean;
  // defaultErrorHandler?: boolean;
}
