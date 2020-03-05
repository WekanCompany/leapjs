import { BindingScope } from '../definitions/binding';

export interface IContainerOptions {
  autowire?: boolean;
  defaultScope?: BindingScope;
}
