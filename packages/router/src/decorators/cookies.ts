import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Cookies(): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('cookies', target, methodName, index);
  };
}

export default Cookies;
