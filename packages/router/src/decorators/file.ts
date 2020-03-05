import { IConstructor, addMethodParamsMetadata } from '@leapjs/common';

function File(options: any, name: string): Function {
  return function wrapper(
    target: IConstructor<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('file', target, methodName, index, name, {
      options,
      maxCount: 1,
    });
  };
}

export default File;
