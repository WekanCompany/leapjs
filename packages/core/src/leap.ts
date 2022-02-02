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
  private container = new Container();
  private logger = Logger.getInstance();

  // TODO Abstract IHttpAdapter with IHttpServer
  // TODO Add execution context to IHttpServer
  public create(server: IHttpAdapter, options: ILeapApplicationOptions): any {
    server.init(this.container, options.prefix ? options.prefix : '');
    this.application = server.create(
      options.corsOptions,
      options.whitelist,
      options.parserOptions,
    );
    server.registerControllers(options.controllers);
    server.registerGlobalMiddlewares(
      options.beforeMiddlewares ? options.beforeMiddlewares : [],
      options.afterMiddlewares ? options.afterMiddlewares : [],
    );
    server.registerRoutes();
    return this.application;
  }

  public connectToDatabase(databaseAdapter: MongoDB): void {
    this.database = new Database(databaseAdapter);
    this.database.connect().catch((error: any) => {
      this.logger.error('Connection timed out', error, 'Database');
    });
  }

  public getContainer(): Container {
    return this.container;
  }
}

export default LeapApplication;
