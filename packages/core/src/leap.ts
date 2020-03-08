import express from 'express';
import { IHttpAdapter, Logger, ILeapApplicationOptions } from '@leapjs/common';
import Database from './database';
import MongoDB from './database/mongodb';
import Container from './dependency-injection/container';

// import AppConfiguration from './configuration/application';

class LeapApplication {
  // private configuration: AppConfiguration;
  private application: express.Express;
  private database: Database;

  // TODO Abstract IHttpAdapter with IHttpServer
  // TODO Add execution context to IHttpServer
  public create(server: IHttpAdapter, options: ILeapApplicationOptions): any {
    server.init(new Container(), options.prefix ? options.prefix : '');
    this.application = server.create(options.corsOptions, options.whitelist);
    server.registerControllers(options.controllers);
    server.registerGlobalMiddlewares(
      options.beforeMiddlewares ? options.beforeMiddlewares : [],
      options.afterMiddlewares ? options.afterMiddlewares : [],
    );
    server.registerRoutes();
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

export default LeapApplication;
