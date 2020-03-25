import { ICrudControllerMethods } from './crud-controller-methods';

export interface ICrudControllerOptions {
  baseRoute: string;
  middleware?: [];
  methods?: ICrudControllerMethods;
  softDelete: boolean;
}
