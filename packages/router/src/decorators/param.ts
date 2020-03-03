import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Param(name: string): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('param', target, methodName, index, name);
  };
}

export default Param;
