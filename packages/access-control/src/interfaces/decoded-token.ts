import { IPermission } from './permission';

export interface IDecodedToken {
  email: string;
  exp: number;
  acl: IPermission[];
}
