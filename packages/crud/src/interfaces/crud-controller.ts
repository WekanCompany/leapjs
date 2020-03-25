import { ICrudControllerMethods } from './crud-controller-methods';

export interface ICrudControllerOptions {
  baseRoute: string;
  middleware?: { before: any[]; after: any[] };
  methods?: ICrudControllerMethods;
  softDelete?: boolean;
}
