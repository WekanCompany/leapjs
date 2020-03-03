import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Req(): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('request', target, methodName, index);
  };
}

export default Req;
