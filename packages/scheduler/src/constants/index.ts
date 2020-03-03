export enum SchedulerJobStatus {
  SCHEDULED = 'scheduled',
  TRIGGERED = 'triggered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum SchedulerLogJobStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export enum SchedulerJobMode {
  ONCE = 'once',
  RECURRING = 'recurring',
}
