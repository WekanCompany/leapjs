import { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
// import { ILeapContainer } from './container';
import { IConstructor } from './constructor';

export interface ILeapApplicationOptions {
  controllers: IConstructor<any>[];
  beforeMiddlewares?: any;
  afterMiddlewares?: any;
  prefix?: string;
  corsOptions?: CorsOptions;
  whitelist?: string[];
  parserOptions?: {
    json: bodyParser.OptionsJson;
    urlencoded: bodyParser.OptionsUrlencoded;
  };
  // classTransformer?: boolean;
  // validation?: boolean;
  // defaultErrorHandler?: boolean;
}
