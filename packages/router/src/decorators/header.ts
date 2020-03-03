import { IType, addMethodParamsMetadata } from '@leapjs/common';

function Header(name: string): Function {
  return function wrapper(
    target: IType<any>,
    methodName: string,
    index: number,
  ): void {
    addMethodParamsMetadata('header', target, methodName, index, name);
  };
}

export default Header;
