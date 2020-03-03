import { IHttpAdapter, Logger } from '@leapjs/common';
import Database from './database';
import MongoDB from './database/mongodb';
import { IServerOptions } from './interfaces/leap';
// import AppConfiguration from './configuration/application';

class Leap {
  // private configuration: AppConfiguration;
  private application: any;
  private database: Database;

  // TODO Abstract IHttpAdapter with IHttpServer
  // TODO Add execution context to IHttpServer
  public create(server: IHttpAdapter, options: IServerOptions): any {
    this.application = server.create(options.corsOptions, options.whitelist);
    this.application.registerControllers(options.controllers);
    // server.mapMiddlewares(options.middlewares);
    this.application.registerRoutes(
      options.middlewares ? options.middlewares : [],
    );
    return this.application;
  }

  // new MongoDB('mongodb://localhost:27017/', 'framework')
  public connectToDatabase(databaseAdapter: MongoDB): void {
    this.database = new Database(databaseAdapter);
    this.database.connect().catch((error: any) => {
      Logger.error('Connection timed out', error, 'Database');
    });
  }
}

export default Leap;
