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

function isClass(obj: Record<string, any>): boolean {
  const isConstructorClass =
    obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
  if (obj.prototype === undefined) {
    return isConstructorClass;
  }
  const isPrototypeConstructorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class';
  return isConstructorClass || isPrototypeConstructorClass;
}

export { expandObject, findMatching, isClass };
