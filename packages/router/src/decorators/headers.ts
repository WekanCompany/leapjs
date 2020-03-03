import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Headers(): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('headers', target, methodName, index);
  };
}

export default Headers;
