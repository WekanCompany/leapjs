import { prop, post, getModelForClass } from '@typegoose/typegoose';

// @post('save', ErrorHandler.mongo('LeapJobLog'))
// @post('findOneAndUpdate', ErrorHandler.mongo('LeapJobLog'))
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
    enum: ['success', 'failure'],
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
