import { ConsumeMessage } from 'amqplib';
import MqConnection from './connection';

class MqReceiver extends MqConnection {
  public async listen(
    queueName: string,
    messageHandler: (msg: ConsumeMessage | null) => any,
    priority = 0,
  ): Promise<void> {
    console.log(' [*] Waiting for messages in %s', queueName);

    try {
      this.channel.consume(queueName, messageHandler, {
        priority,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const receiver = new MqReceiver();
export default receiver;
