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

function getRandom(minimum: number, maximum: number): number {
  const min = Math.ceil(minimum);
  return Math.floor(Math.random() * (Math.floor(maximum) - min)) + min;
}

function pad(n: string, padWith: string, width: number): string {
  return n.length >= width
    ? n
    : new Array(width - n.length + 1).join(padWith) + n;
}

function addToDate(
  date: Date,
  interval: string,
  units: number,
): Date | undefined {
  if (!(date instanceof Date)) {
    return undefined;
  }
  let newDate = new Date(date);

  const checkRollover = () => {
    if (newDate.getDate() !== date.getDate()) {
      newDate.setDate(0);
    }
  };

  switch (String(interval).toLowerCase()) {
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + units);
      checkRollover();
      break;
    case 'quarter':
      newDate.setMonth(newDate.getMonth() + 3 * units);
      checkRollover();
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + units);
      checkRollover();
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + 7 * units);
      break;
    case 'day':
      newDate.setDate(newDate.getDate() + units);
      break;
    case 'hour':
      newDate.setTime(newDate.getTime() + units * 3600000);
      break;
    case 'minute':
      newDate.setTime(newDate.getTime() + units * 60000);
      break;
    case 'second':
      newDate.setTime(newDate.getTime() + units * 1000);
      break;
    default:
      newDate = undefined as any;
      break;
  }
  return newDate;
}

export { expandObject, findMatching, isClass, getRandom, pad, addToDate };
