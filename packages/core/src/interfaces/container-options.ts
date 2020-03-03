import { BindingScope } from '../dependency-injection/definitions/binding';

export interface IContainerOptions {
  autowire?: boolean;
  defaultScope?: BindingScope;
}
