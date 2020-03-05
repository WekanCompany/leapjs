import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function Cookie(name: string): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('cookie', target, methodName, index, name);
  };
}

export default Cookie;
