import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Files(options: any, name = ''): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('files', target, methodName, index, name, options);
  };
}

export default Files;
