import { prop } from '@typegoose/typegoose';
import { RoleStatus } from 'src/constants';
import Permission from './permission';

class BaseRole {
  @prop({ required: true, unique: true })
  public role!: string;

  @prop({ required: true })
  public scope!: string;

  @prop({ required: true })
  public permissions!: Permission[];

  @prop({ default: RoleStatus.ACTIVE })
  public status?: number;
}

export default BaseRole;
