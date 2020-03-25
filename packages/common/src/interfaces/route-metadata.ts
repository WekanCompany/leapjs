import { IConstructor } from './constructor';

export interface IRouteMetadata {
  type: string;
  target: IConstructor<any>;
  methodName: string;
  index: number;
  name: string;
  options: any;
}
