import { ctor } from '@leapjs/common';
import { IAttributes } from '../interfaces/attributes';
import { IMethodParams } from '../interfaces/method-params';
import { IController } from '../interfaces/controller';

class ServerRegistry {
  attributes = new Map<ctor<Function>, IAttributes[]>();
  methodParams = new Map<string, IMethodParams>();
  controllers = new Map<ctor<Function>, IController>();
  middlewares = new Map<string, any>();
}

export default ServerRegistry;
