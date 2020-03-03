import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Res(): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('response', target, methodName, index);
  };
}

export default Res;
