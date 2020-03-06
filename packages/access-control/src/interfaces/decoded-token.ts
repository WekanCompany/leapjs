import Permission from '../models/permission';

interface IDecodedToken {
  email: string;
  exp: number;
  acl: Permission[];
}

export { IDecodedToken };
