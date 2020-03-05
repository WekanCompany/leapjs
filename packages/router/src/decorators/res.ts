import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function Res(): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('response', target, methodName, index);
  };
}

export default Res;
