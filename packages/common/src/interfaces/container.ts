import { IConstructor } from './constructor';

export interface ILeapContainer {
  resolve<T>(target: IConstructor<any>): T;
}
