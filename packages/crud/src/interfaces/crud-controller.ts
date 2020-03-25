import { IConstructor } from '@leapjs/common';
import { ICrudControllerMethods } from './crud-controller-methods';

export interface ICrudControllerOptions {
  baseRoute: string;
  model: IConstructor<any>;
  methods?: ICrudControllerMethods;
  softDelete?: boolean;
}
