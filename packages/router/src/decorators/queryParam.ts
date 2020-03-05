import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function QueryParam(name: string): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('query', target, methodName, index, name);
  };
}

export default QueryParam;
