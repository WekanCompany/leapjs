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

import { IHttpAdapter } from './interfaces/http-adapter';
import { ILogger } from './interfaces/logger';
import { IConstructor } from './interfaces/constructor';

import Logger from './services/logger';

import { ctor, ServiceIdentifierOrFunc } from './definitions/injector';

import inject from './decorators/core/inject';
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
} from './utils/helpers';
import { ILeapContainer } from './interfaces/container';
import { BindingScope } from './definitions/binding';
import { IContainerOptions } from './interfaces/container-options';
import { IIdentifier } from './interfaces/identifier';
import { ILeapApplicationOptions } from './interfaces/application-options';
import mongoErrorHandler from './errors/handlers/database/mongo';

export {
  Metadata,
  DESIGN_PARAM_TYPES,
  LEAP_PARAM_TYPES,
  LEAP_TAGGED_PARAMETERS,
  LEAP_TAGGED_PROPERTIES,
  LEAP_ROUTER_CONTROLLER_METHODS,
  LEAP_ROUTER_MIDDLEWARE,
  HttpStatus,
  inject,
  injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  NotAcceptableException,
  ConflictException,
  ValidationException,
  InternalServerException,
  HttpException,
  IHttpAdapter,
  ILogger,
  IConstructor,
  Logger,
  registerCleanup,
  ctor,
  ServiceIdentifierOrFunc,
  HTTP_METHODS,
  addMethodMetadata,
  addMethodParamsMetadata,
  expandObject,
  findMatching,
  isClass,
  getRandom,
  pad,
  mongoErrorHandler,
  ILeapContainer,
  BindingScope,
  IContainerOptions,
  IIdentifier,
  ILeapApplicationOptions,
};
