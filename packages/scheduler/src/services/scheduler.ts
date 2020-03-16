import { CronJob } from 'cron';
import { Logger } from '@leapjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { parseExpression } from 'cron-parser';
import { LeapJobModel, LeapJob } from '../models/job';
import { LeapJobLogModel } from '../models/job-log';
import { SchedulerJobStatus, SchedulerJobMode } from '../constants';
import { IParserOptions } from '../interfaces';
import { schedulerJobStatus, schedulerJobMode } from '../types';
import {
  INVALID_JOB_DATA,
  REPEAT_PATTERN_EMPTY,
  ERROR_JOB_CREATION,
} from '../resources/strings';

class Scheduler {
  private frequencyPattern = '* * * * *';
  private scheduler!: CronJob;
  private publisher!: any;
  // private logger = Logger.getInstance();
  private static logger = Logger.getInstance();

  constructor(publisher: any) {
    this.scheduler = new CronJob(
      this.frequencyPattern,
      this.dispatcher,
      undefined,
      undefined,
      undefined,
      this,
    );
    this.publisher = publisher;
  }

  public static async logJob(
    job: any,
    status: schedulerJobStatus,
  ): Promise<void> {
    new LeapJobLogModel({
      id: job._id,
      name: job.name,
      runOn: job.lastRunOn ? job.lastRunOn : new Date(),
      type: job.type,
      data: job.data,
      status,
    }).save();
  }

  private static async updateJobStatus(
    data: any,
    status: schedulerJobStatus,
  ): Promise<void> {
    const job = 'job' in data ? data.job : data;
    const { _id } = job;

    if (!_id) {
      Promise.reject(new Error(INVALID_JOB_DATA));
      return;
    }

    if (!data.reschedule) {
      LeapJobModel.findByIdAndUpdate(job._id, { status }).catch(
        (error: any) => {
          this.logger.error('Error updating job status', error, 'Scheduler');
        },
      );
    }

    Scheduler.logJob(job, status);
  }

  private async dispatcher(): Promise<void> {
    const logger = Logger.getInstance();
    logger.log(`Starting up dispatcher ...`, 'Scheduler');
    if (!this.publisher.isConnected()) {
      logger.error('Publisher is undefined', '', 'Scheduler');
      return;
    }

    LeapJobModel.find({ status: SchedulerJobStatus.SCHEDULED })
      .then((result: DocumentType<LeapJob>[]) => {
        if (result) {
          result.forEach(async (job: DocumentType<LeapJob>) => {
            const currentTime = new Date();
            let reschedule = true;

            if (
              job.type === SchedulerJobMode.RECURRING &&
              job.nextRunOn <= currentTime &&
              job.repeatPattern
            ) {
              try {
                // Handle recurring jobs
                const options: IParserOptions = {};
                options.currentDate = job.nextRunOn;
                if (job.endOn) {
                  options.endDate = job.endOn;
                }

                // any needed as a workaround as cron-parser types aren't
                // defined correctly
                const pInterval: any = parseExpression(
                  job.repeatPattern,
                  options,
                );
                const nInterval: any = parseExpression(
                  job.repeatPattern,
                  options,
                );
                if (!pInterval.hasNext()) {
                  reschedule = false;
                }

                // eslint-disable-next-line no-param-reassign
                job.lastRunOn = currentTime;
                // eslint-disable-next-line no-param-reassign
                job.nextRunOn = nInterval.next().toDate();
                await job.save();

                this.publisher
                  .queueJob(job.event, job, reschedule)
                  .catch((error: any) => {
                    logger.error('Failed to queue job', error, 'Scheduler');
                  });
              } catch (error) {
                Scheduler.updateJobStatus(job, SchedulerJobStatus.COMPLETED);
              }
            } else if (
              job.type === SchedulerJobMode.ONCE &&
              job.startOn <= currentTime
            ) {
              // Handle one-off jobs
              // eslint-disable-next-line no-param-reassign
              job.status = SchedulerJobStatus.TRIGGERED;
              await job.save();

              this.publisher.queueJob(job.event, job).catch((error: any) => {
                logger.error('Failed to queue job', error, 'Scheduler');
              });
            }
          });
        }
      })
      .catch((error) => {
        logger.error('Error triggering jobs', error);
      });
  }

  public static async rescheduleJob(job: DocumentType<LeapJob>): Promise<void> {
    Scheduler.updateJobStatus(job, SchedulerJobStatus.SCHEDULED);
  }

  public static async endJob(job: DocumentType<LeapJob>): Promise<void> {
    Scheduler.updateJobStatus(
      job,
      SchedulerJobStatus.COMPLETED,
    ).catch((error) => this.logger.error(error, '', 'Scheduler'));
  }

  public start(): void {
    this.scheduler.start();
  }

  public async createJob(
    name: string,
    event: string,
    type: schedulerJobMode,
    data: any,
    start?: Date,
    end?: Date,
    repeatPattern?: string,
  ): Promise<any> {
    const startDate = start || new Date();
    let runOn = start;

    if (end && !repeatPattern) {
      return Promise.reject(new Error(REPEAT_PATTERN_EMPTY));
    }

    startDate.setSeconds(0);
    // eslint-disable-next-line no-unused-expressions
    end?.setSeconds(0);

    if (repeatPattern) {
      const options: IParserOptions = {};
      options.currentDate = startDate;
      if (end) {
        options.endDate = end;
      }

      try {
        runOn = parseExpression(repeatPattern, options)
          .next()
          .toDate();
      } catch (error) {
        return Promise.reject(
          new Error(`${ERROR_JOB_CREATION} - ${error.message}`),
        );
      }
    }

    const job = await new LeapJobModel({
      name,
      event,
      type,
      data,
      startOn: startDate,
      endOn: end || null,
      repeatPattern: repeatPattern || null,
      nextRunOn: runOn,
      status: 'scheduled',
    }).save();
    return job._id;
  }

  public static async cancelJob(jobId: string): Promise<void> {
    LeapJobModel.findByIdAndUpdate(jobId, {
      status: SchedulerJobStatus.CANCELLED,
    })
      .then(() => {
        this.logger.log(`${jobId} cancelled`, 'Scheduler');
      })
      .catch((error: any) => {
        this.logger.error('Error cancelling job', error, 'Scheduler');
      });
  }

  public async stop(): Promise<void> {
    this.scheduler.stop();
  }
}

export default Scheduler;
