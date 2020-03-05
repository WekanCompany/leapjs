import { IConstructor } from '../interfaces/constructor';

type Newable<T> = new (...args: any[]) => T;
type Abstract<T> = { prototype: T };
type ServiceIdentifier<T> = string | symbol | Newable<T> | Abstract<T>;

export type ServiceIdentifierOrFunc = ServiceIdentifier<any>;

export type ctor<T> = {
  new (...args: any[]): T;
};

export type Dictionary<T> = {
  [key: string]: T;
};

export type InjectionToken<T = any> = IConstructor<T> | string | symbol;
