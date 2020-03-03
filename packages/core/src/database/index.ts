// TODO add support for typeorm
import MongoDB from './mongodb';

class Database {
  private instance!: MongoDB;

  constructor(instance: MongoDB) {
    this.instance = instance;
  }

  public async connect(): Promise<void> {
    this.instance.connect();
  }
}

export default Database;
