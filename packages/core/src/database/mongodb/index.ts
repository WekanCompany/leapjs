import mongoose from 'mongoose';
import { Logger } from '@leapjs/common';

class MongoDB {
  private host!: string;
  private database!: string;
  private options!: mongoose.ConnectionOptions;
  private logger = Logger.getInstance();

  constructor(
    host: string,
    database: string,
    providedOptions?: mongoose.ConnectionOptions,
  ) {
    this.host = host;
    this.database = database;
    /**
     * Options for mongodb connection
     * https://mongoosejs.com/docs/deprecations.html
     */
    this.options = providedOptions || {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
  }

  public connect(): Promise<{}> {
    const databaseUri = this.host + this.database;

    return new Promise((resolve, reject): void => {
      mongoose.connect(databaseUri, this.options).catch((error) => {
        this.logger.error(
          `Connection to ${this.host} timed out`,
          error,
          'Database',
        );
      });
      mongoose.connection.on('open', (): void => {
        resolve('Success');
      });
      mongoose.connection.on('error', (error): void => {
        reject(error);
      });
      mongoose.connection.on('disconnected', (): void => {
        this.logger.warn('Database connection dropped');
        mongoose.connect(databaseUri, this.options).catch((error) => {
          this.logger.error(
            `Connection to ${this.host} timed out`,
            error,
            'Database',
          );
        });
      });
      mongoose.connection.on('reconnected', (): void => {
        this.logger.log(`Reconnected to ${this.host}`, 'Database');
      });
      process.on('SIGINT', (): void => {
        mongoose.connection.close((): void => {
          this.logger.error(
            `Connection to ${this.host} closed`,
            '',
            'Database',
          );
          process.exit(0);
        });
      });
    });
  }
}

export default MongoDB;
