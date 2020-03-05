import { IAttributes } from './attributes';

export interface IController {
  class: Function;
  baseRoute: string;
  attributes: IAttributes[];
}
