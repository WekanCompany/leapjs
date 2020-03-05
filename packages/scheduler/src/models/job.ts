import { prop, post, getModelForClass, index } from '@typegoose/typegoose';
import { mongoErrorHandler } from '@leapjs/common';

@index({ name: 1 })
@post('save', mongoErrorHandler('LeapJob'))
@post('findOneAndUpdate', mongoErrorHandler('LeapJob'))
class LeapJob {
  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ required: true })
  public event!: string;

  @prop({ required: true, trim: true, enum: ['once', 'recurring'] })
  public type!: string;

  @prop({ required: true })
  public data!: any;

  @prop({ required: true })
  public startOn: Date;

  @prop({ default: null })
  public endOn?: Date;

  @prop({ default: null })
  public repeatPattern?: string;

  // TODO add tz support
  @prop({ default: null })
  public timezone?: string;

  @prop({ default: null })
  public lastRunOn?: Date;

  @prop({ required: true })
  public nextRunOn: Date;

  @prop({
    required: true,
    trim: true,
    enum: ['scheduled', 'triggered', 'completed', 'cancelled'],
  })
  public status!: string;
}

const LeapJobModel = getModelForClass(LeapJob, {
  schemaOptions: {
    id: false,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
});

export { LeapJob, LeapJobModel };
