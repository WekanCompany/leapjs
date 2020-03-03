import 'reflect-metadata';

import { HTTP_METHODS } from './definitions/router';
import injectable from './decorators/core/injectable';

import registerCleanup from './exceptions/handlers/register';
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

import { IHttpAdapter } from './interfaces/application';
import { ILogger } from './interfaces/logger';
import { IType } from './interfaces/type';
import {
  IAttributes,
  IController,
  IMethodParams,
  IParameter,
} from './interfaces/router';

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
import { expandObject, findMatching } from './utils/helpers';

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
  IType,
  IAttributes,
  IController,
  IMethodParams,
  IParameter,
  Logger,
  registerCleanup,
  ctor,
  ServiceIdentifierOrFunc,
  HTTP_METHODS,
  addMethodMetadata,
  addMethodParamsMetadata,
  expandObject,
  findMatching,
};
