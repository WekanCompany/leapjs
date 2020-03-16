import { connect, Connection, Channel, Message } from 'amqplib';
import { Logger } from '@leapjs/common';

class MqConnection {
  public connection!: Connection;
  protected channel!: Channel;
  protected logger = Logger.getInstance();

  public async init(url: string): Promise<void> {
    await this.createConnection(url);
  }

  private errorHandler(error): void {
    this.logger.error('Connection error', error, 'RabbitMQ');
  }

  private closeHandler(error): void {
    this.logger.error('Connection closed', error, 'RabbitMQ');
  }

  public isConnected(): boolean {
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
        this.logger.error('Failed to create connection', error, 'RabbitMQ');
      });
  }

  public async ack(messageName: Message): Promise<void> {
    this.channel.ack(messageName);
  }

  public close(): void {
    this.connection.close();
  }
}

export default MqConnection;
