import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function Body(): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('body', target, methodName, index);
  };
}

export default Body;
