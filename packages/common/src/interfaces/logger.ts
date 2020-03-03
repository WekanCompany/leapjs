export interface ILogger {
  log(message: any): Promise<void>;
  error(message: any, trace: string): Promise<void>;
  debug(message: any): Promise<void>;
  warn(message: any): Promise<void>;
  verbose(message: any): Promise<void>;
}
