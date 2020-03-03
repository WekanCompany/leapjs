import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Body(): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('body', target, methodName, index);
  };
}

export default Body;
