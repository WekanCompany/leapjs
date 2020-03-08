export interface ILogger {
  log(message: any, context?: string): Promise<void>;
  error(message: any, trace: string, context?: string): Promise<void>;
  debug(message: any, context?: string): Promise<void>;
  warn(message: any, context?: string): Promise<void>;
  verbose(message: any, context?: string): Promise<void>;
}
