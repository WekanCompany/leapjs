import { DocumentType } from '@typegoose/typegoose';
import { LeapJob, Scheduler } from '@leapjs/scheduler';
import MqConnection from './connection';

class MqPublisher extends MqConnection {
  private sendToQueue(queueName: string, data: any): void {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  }

  public async send(queueName: string, data: any): Promise<void> {
    try {
      this.sendToQueue(queueName, data);
    } catch (error) {
      this.logger.log(`Publish message failed ${error}`);
    }
  }

  public async queueJob(
    queueName: string,
    job: DocumentType<LeapJob>,
    reschedule?: boolean,
  ): Promise<void> {
    try {
      const args: any = {
        job,
        reschedule: reschedule !== undefined ? reschedule : false,
      };
      this.sendToQueue(queueName, args);
    } catch (error) {
      this.logger.log(`Error sending job to the queue ${error}`);
      Scheduler.rescheduleJob(job);
    }
  }
}

const queue = new MqPublisher();
export default queue;
