import util from 'util';

function expandObject(obj: any, depth = 2): string {
  return util.inspect(obj, false, depth, true);
}

function findMatching(key: string, actionArray: string[], arr: any[]): any {
  const tmpArr: any = [];
  for (let i = 0, j = 0; i < arr.length; i += 1) {
    if (actionArray.some((substring) => arr[i][key].includes(substring))) {
      tmpArr[j] = arr[i];
      j += 1;
    }
  }
  return tmpArr;
}

function isClass(object): boolean {
  const isConstructorClass =
    object.constructor &&
    object.constructor.toString().substring(0, 5) === 'class';
  if (object.prototype === undefined) {
    return isConstructorClass;
  }
  const isPrototypeConstructorClass =
    object.prototype.constructor &&
    object.prototype.constructor.toString &&
    object.prototype.constructor.toString().substring(0, 5) === 'class';
  return isConstructorClass || isPrototypeConstructorClass;
}

export { expandObject, findMatching, isClass };
