import express from 'express';
import cors from 'cors';
import { ORIGIN_BLOCKED } from '../../resources/strings';

class Cors {
  private whitelist!: string[];
  private options: cors.CorsOptions;

  constructor(options?: cors.CorsOptions, whitelist?: string[]) {
    this.options = options || {
      origin: this.corsOriginFilter,
      credentials: true,
    };
    this.whitelist = whitelist || ['http://localhost'];
  }

  public cors(server: express.Express): void {
    server.use(cors(this.options));
  }

  public corsOriginFilter(
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
