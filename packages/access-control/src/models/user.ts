import { prop, Ref } from '@typegoose/typegoose';
import { IsDefined } from 'class-validator';
import ERROR_MISSING_ROLE from '../resources/strings';
import BaseRole from './role';

class UserRole {
  @prop({ ref: BaseRole })
  @IsDefined({
    groups: ['create'],
    message: ERROR_MISSING_ROLE,
  })
  public role!: Ref<BaseRole>;
}

export default UserRole;
