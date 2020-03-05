import { prop, post, getModelForClass } from '@typegoose/typegoose';
import { mongoErrorHandler } from '@leapjs/common';

@post('save', mongoErrorHandler('LeapJobLog'))
@post('findOneAndUpdate', mongoErrorHandler('LeapJobLog'))
class LeapJobLog {
  @prop({ required: true })
  public id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public runOn!: Date;

  @prop({ required: true, trim: true, enum: ['once', 'recurring'] })
  public type!: string;

  @prop({ required: true })
  public data!: any;

  @prop({
    required: true,
    trim: true,
    enum: ['scheduled', 'triggered', 'completed', 'cancelled'],
  })
  public status!: string;
}

const LeapJobLogModel = getModelForClass(LeapJobLog, {
  schemaOptions: {
    id: false,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
});

export { LeapJobLog, LeapJobLogModel };
