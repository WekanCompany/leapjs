import { ctor, IAttributes, IController, IMethodParams } from '@leapjs/common';

class ServerRegistry {
  attributes = new Map<ctor<Function>, IAttributes[]>();
  methodParams = new Map<string, IMethodParams>();
  controllers = new Map<ctor<Function>, IController>();
  middlewares = new Map<string, any>();
}

export default ServerRegistry;
