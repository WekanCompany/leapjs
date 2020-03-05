import { ConsumeMessage } from 'amqplib';
import { Logger } from '@leapjs/common';
import MqConnection from './connection';

class MqReceiver extends MqConnection {
  public async listen(
    queueName: string,
    messageHandler: (msg: ConsumeMessage | null) => any,
    priority = 0,
  ): Promise<void> {
    Logger.log(`Waiting for messages in ${queueName}`, 'Receiver');

    try {
      await this.channel.consume(queueName, messageHandler, {
        priority,
      });
    } catch (error) {
      Logger.error('Error consuming messages', error, 'Receiver');
    }
  }
}

const receiver = new MqReceiver();
export default receiver;
