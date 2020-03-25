import 'reflect-metadata';

import { HTTP_METHODS } from './definitions/router';
import injectable from './decorators/core/injectable';

import registerCleanup from './errors/handlers/register';
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  NotAcceptableException,
  ConflictException,
  ValidationException,
  InternalServerException,
} from './exceptions/wrappers';
import HttpException from './exceptions/http-exception';
import mongoErrorHandler from './errors/handlers/database/mongo';

import { IHttpAdapter } from './interfaces/http-adapter';
import { ILogger } from './interfaces/logger';
import { IConstructor } from './interfaces/constructor';

import Logger from './services/logger';

import { ctor, ServiceIdentifierOrFunc } from './definitions/injector';

import inject from './decorators/core/inject';
import injectValue from './decorators/core/inject-value';
import Metadata from './classes/metadata';

import {
  DESIGN_PARAM_TYPES,
  LEAP_PARAM_TYPES,
  LEAP_TAGGED_PARAMETERS,
  LEAP_TAGGED_PROPERTIES,
  LEAP_ROUTER_CONTROLLER_METHODS,
  LEAP_ROUTER_MIDDLEWARE,
  HttpStatus,
} from './constants';

import { addMethodMetadata, addMethodParamsMetadata } from './utils/metadata';
import {
  expandObject,
  findMatching,
  isClass,
  getRandom,
  pad,
  addToDate,
} from './utils/helpers';

import { BindingScope } from './definitions/binding';
import { ILeapContainer } from './interfaces/container';
import { IContainerOptions } from './interfaces/container-options';
import { IIdentifier } from './interfaces/identifier';
import { ILeapApplicationOptions } from './interfaces/application-options';
import { IRouteMetadata } from './interfaces/route-metadata';

export {
  addMethodMetadata,
  addMethodParamsMetadata,
  IRouteMetadata,
  addToDate,
  BadRequestException,
  BindingScope,
  ConflictException,
  ctor,
  DESIGN_PARAM_TYPES,
  expandObject,
  findMatching,
  ForbiddenException,
  getRandom,
  HTTP_METHODS,
  HttpException,
  HttpStatus,
  IConstructor,
  IContainerOptions,
  IHttpAdapter,
  IIdentifier,
  ILeapApplicationOptions,
  ILeapContainer,
  ILogger,
  inject,
  injectable,
  injectValue,
  InternalServerException,
  isClass,
  LEAP_PARAM_TYPES,
  LEAP_ROUTER_CONTROLLER_METHODS,
  LEAP_ROUTER_MIDDLEWARE,
  LEAP_TAGGED_PARAMETERS,
  LEAP_TAGGED_PROPERTIES,
  Logger,
  Metadata,
  mongoErrorHandler,
  NotAcceptableException,
  NotFoundException,
  pad,
  registerCleanup,
  ServiceIdentifierOrFunc,
  UnauthorizedException,
  ValidationException,
};
