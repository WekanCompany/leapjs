import { IMethodParams } from './method-params';

export interface IAttributes {
  httpMethod: string;
  route: string;
  method: Function;
  methodParams: IMethodParams;
}
