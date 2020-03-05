import { prop } from '@typegoose/typegoose';

class Permission {
  @prop({ required: true })
  public resource!: string;

  @prop({ required: true })
  public action!: string;

  @prop({ required: true })
  public attributes!: string;
}

export default Permission;
