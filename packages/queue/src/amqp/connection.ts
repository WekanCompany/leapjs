import { connect, Connection, Channel, Message } from 'amqplib';

class MqConnection {
  public connection!: Connection;
  protected channel!: Channel;

  public async init(url: string): Promise<void> {
    try {
      await this.createConnection(url);
    } catch (error) {
      console.log('Init connection failed - ', error);
    }
  }

  private errorHandler(error): void {
    console.log('Connection error - ', error);
  }

  private closeHandler(error): void {
    console.log('connection closed - ', error);
  }

  public isConnected() {
    return !!this.channel;
  }

  public createQueue(name: string, options = { durable: true }): void {
    if (this.channel) {
      this.channel.assertQueue(name, options);
    }
  }

  private async createConnection(url: string): Promise<void> {
    await connect(url)
      .then(async (connection: Connection) => {
        this.connection = connection;
        this.connection.addListener('error', this.errorHandler);
        this.connection.addListener('close', this.closeHandler);
        return this.connection.createConfirmChannel();
      })
      .then((channel: Channel) => {
        this.channel = channel;
      })
      .catch((error) => {
        console.log('Connect to RMQ failed - ', error);
      });
  }

  public async ack(messageName: Message): Promise<void> {
    this.channel.ack(messageName);
  }

  public close(): void {
    this.connection.close();
  }
}

// const queue = new Queue();
export default MqConnection;
