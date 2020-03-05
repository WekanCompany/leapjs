import Metadata from '../classes/metadata';
import { IMetadataResult } from '../interfaces/reflect-metadata';
import { IConstructor } from '../interfaces/constructor';
import {
  LEAP_PARAM_TYPES,
  LEAP_TAGGED_PARAMETERS,
  LEAP_TAGGED_PROPERTIES,
  LEAP_ROUTER_CONTROLLER_METHODS,
  DESIGN_PARAM_TYPES,
} from '../constants';
import {
  INVALID_DECORATOR_OPERATION,
  DUPLICATED_METADATA,
} from '../resources/strings';
import { InjectionToken, Dictionary, ctor } from '../definitions/injector';

function setCtorParams(target: ctor<any>): void {
  // params is a reference to the target metadata, not a copy of it
  const params: any = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
  const injectionTokens: Dictionary<InjectionToken<any>> =
    Reflect.getOwnMetadata(LEAP_TAGGED_PARAMETERS, target) || {};
  const { length } = Object.keys(injectionTokens);
  for (let i = 0; i < length; i += 1) {
    params[i] = injectionTokens[i];
  }
}

function addMetadata(
  metadataKey: string,
  target: any,
  propertyName: string,
  metadata: Metadata,
  parameterIndex?: number,
): void {
  let paramsOrPropertiesMetadata: IMetadataResult = {};
  const isParameterDecorator = typeof parameterIndex === 'number';
  const key: string =
    parameterIndex !== undefined && isParameterDecorator
      ? parameterIndex.toString()
      : propertyName;

  if (isParameterDecorator && propertyName !== undefined) {
    throw new Error(INVALID_DECORATOR_OPERATION);
  }

  if (Reflect.hasOwnMetadata(metadataKey, target)) {
    paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, target);
  }

  let paramOrPropertyMetadata: Metadata[] = paramsOrPropertiesMetadata[key];

  if (!Array.isArray(paramOrPropertyMetadata)) {
    paramOrPropertyMetadata = [];
  } else {
    for (let i = 0; i < paramOrPropertyMetadata.length; i += 1) {
      if (paramOrPropertyMetadata[i].key === metadata.key) {
        throw new Error(DUPLICATED_METADATA);
      }
    }
  }

  paramOrPropertyMetadata.push(metadata);
  paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
  Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, target);
}

function addPropertyMetadata(
  target: any,
  propertyName: string,
  metadata: Metadata,
): void {
  const metadataKey = LEAP_TAGGED_PROPERTIES;
  addMetadata(metadataKey, target.constructor, propertyName, metadata);
}

function addParameterMetadata(
  target: any,
  propertyName: string,
  parameterIndex: number,
  metadata: Metadata,
): void {
  const metadataKey = LEAP_TAGGED_PARAMETERS;
  addMetadata(metadataKey, target, propertyName, metadata, parameterIndex);
}

function addMethodMetadata(
  method: string,
  target: IConstructor<any>,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  route: string,
): void {
  const existingMetadata: any = [];
  const meta = Reflect.getMetadata(LEAP_ROUTER_CONTROLLER_METHODS, target);
  if (meta !== undefined) {
    existingMetadata.push(...meta);
  }
  existingMetadata.push({
    method,
    target,
    propertyKey,
    descriptor,
    route,
  });
  Reflect.defineMetadata(
    LEAP_ROUTER_CONTROLLER_METHODS,
    existingMetadata,
    target,
  );
}

function addMethodParamsMetadata(
  type: string,
  target: IConstructor<any>,
  methodName: string,
  index: number,
  name = '',
  options?: any,
): void {
  const existingMetadata: any = [];
  const meta = Reflect.getMetadata(LEAP_PARAM_TYPES, target);
  if (meta !== undefined) {
    existingMetadata.push(...meta);
  }
  existingMetadata.push({
    type,
    target,
    methodName,
    index,
    name,
    options,
  });
  Reflect.defineMetadata(LEAP_PARAM_TYPES, existingMetadata, target);
}

export {
  setCtorParams,
  addPropertyMetadata,
  addParameterMetadata,
  addMethodMetadata,
  addMethodParamsMetadata,
};
