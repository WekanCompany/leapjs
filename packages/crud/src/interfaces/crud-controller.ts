import { ICrudControllerMethods } from './crud-controller-methods';

export interface ICrudControllerOptions {
  baseRoute: string;
  methods?: ICrudControllerMethods;
  softDelete?: boolean;
}
