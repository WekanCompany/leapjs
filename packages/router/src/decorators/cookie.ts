import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Cookie(name: string): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('cookie', target, methodName, index, name);
  };
}

export default Cookie;
