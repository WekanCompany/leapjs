import { ORIGIN_BLOCKED } from '../../../resources/strings';

class Cors {
  private static whitelist: string[];

  public static setWhitelist(whitelist: string[]): void {
    this.whitelist = whitelist;
  }

  public static corsOriginFilter(
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ): void {
    if (origin && this.whitelist.indexOf(origin) === -1) {
      callback(new Error(ORIGIN_BLOCKED));
    }
    callback(null, true);
  }
}

export default Cors;
