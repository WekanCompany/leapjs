import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function Req(): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('request', target, methodName, index);
  };
}

export default Req;
