import { ConsumeMessage } from 'amqplib';
import MqConnection from './connection';

class MqReceiver extends MqConnection {
  public async listen(
    queueName: string,
    messageHandler: (msg: ConsumeMessage | null) => any,
    priority = 0,
  ): Promise<void> {
    this.logger.log(`Waiting for messages in ${queueName}`, 'Receiver');

    try {
      await this.channel.consume(queueName, messageHandler, {
        priority,
      });
    } catch (error) {
      this.logger.error('Error consuming messages', error, 'Receiver');
    }
  }
}

const receiver = new MqReceiver();
export default receiver;
