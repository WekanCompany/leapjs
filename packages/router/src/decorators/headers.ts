import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function Headers(): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('headers', target, methodName, index);
  };
}

export default Headers;
