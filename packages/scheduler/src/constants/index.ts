enum SchedulerJobMode {
  ONCE = 'once',
  RECURRING = 'recurring',
}

enum SchedulerJobStatus {
  SCHEDULED = 'scheduled',
  TRIGGERED = 'triggered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

enum SchedulerLogJobStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export { SchedulerJobMode, SchedulerJobStatus, SchedulerLogJobStatus };
