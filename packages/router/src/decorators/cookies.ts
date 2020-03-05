import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function Cookies(): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('cookies', target, methodName, index);
  };
}

export default Cookies;
