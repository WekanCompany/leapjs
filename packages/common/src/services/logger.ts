import chalk from 'chalk';
import injectable from '../decorators/core/injectable';
import { ILogger } from '../interfaces/logger';
import { logLevel } from '../definitions/logger';
import { expandObject } from '../utils/helpers';

@injectable()
class Logger implements ILogger {
  private static logLevels: logLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];

  private static localeStringOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  private static instance: typeof Logger | ILogger = Logger;
  private context = '';

  constructor(context = '') {
    this.context = context;
  }

  public async log(message: any, context = ''): Promise<void> {
    this.call('log', message, this.context === '' ? context : this.context);
  }

  public async warn(message: any, context = ''): Promise<void> {
    this.call('warn', message, this.context === '' ? context : this.context);
  }

  public async debug(message: any, context = ''): Promise<void> {
    this.call('debug', message, this.context === '' ? context : this.context);
  }

  public async error(message: any, trace: string, context = ''): Promise<void> {
    if (this.isLogLevelEnabled('error')) {
      const instance = this.getInstance();
      if (instance) {
        instance.error.call(
          instance,
          message,
          trace,
          this.context === '' ? context : this.context,
        );
      }
    }
  }

  public setContext(context: string): void {
    this.context = context;
  }

  public async verbose(message: any, context = ''): Promise<void> {
    this.call('verbose', message, this.context === '' ? context : this.context);
  }

  private isLogLevelEnabled(level: logLevel): boolean {
    return Logger.logLevels.includes(level);
  }

  private getInstance(): typeof Logger | ILogger {
    const { instance } = Logger;
    return instance === this ? Logger : instance;
  }

  public static getInstance(): typeof Logger | ILogger {
    return this.instance;
  }

  private call(
    name: 'log' | 'warn' | 'debug' | 'verbose',
    message: any,
    context: string,
  ): void {
    if (this.isLogLevelEnabled(name)) {
      const instance = this.getInstance();
      const func = instance && (instance as typeof Logger)[name];
      if (func) {
        func.call(instance, message, context);
      }
    }
  }

  public static use(logger: ILogger): void {
    Logger.instance = logger;
  }

  public static getTimestampFormat(): Intl.DateTimeFormatOptions {
    return Logger.localeStringOptions;
  }

  public static setTimestampFormat(format: Intl.DateTimeFormatOptions): void {
    Logger.localeStringOptions = format;
  }

  public static async debug(message: any, context = ''): Promise<void> {
    Logger.print(chalk.yellowBright.bold(message), context);
  }

  public static async log(message: any, context = ''): Promise<void> {
    Logger.print(chalk.greenBright(message), context);
  }

  public static async warn(message: any, context = ''): Promise<void> {
    Logger.print(chalk.redBright(message), context);
  }

  public static async error(
    message: any,
    trace: string,
    context = '',
  ): Promise<void> {
    Logger.print(chalk.red.bold(message), context);
    if (trace) {
      Logger.print(chalk.red.bold(expandObject(trace)), context);
    }
  }

  public static async verbose(message: any, context = ''): Promise<void> {
    Logger.print(chalk.grey(message), context);
  }

  private static print(message: any, context = ''): void {
    const timestamp = new Date(Date.now()).toLocaleString(
      undefined,
      Logger.localeStringOptions,
    );
    process.stdout.write(
      `${chalk.greenBright('[Leap]')} ${chalk.greenBright(
        `${process.pid}\t- `,
      )}${chalk.hex('#fafafa')(timestamp)}  ${chalk.yellow(
        `[${context}]`,
      )} ${message}\n`,
    );
  }
}

export default Logger;
