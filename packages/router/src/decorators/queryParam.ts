import { IType, addMethodParamsMetadata } from '@leapjs/common';

function QueryParam(name: string): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('query', target, methodName, index, name);
  };
}

export default QueryParam;
