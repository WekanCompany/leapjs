import { IParameter } from './paramter';

export interface IMethodParams {
  query: IParameter[];
  param: IParameter[];
  body: IParameter[];
  request: IParameter[];
  response: IParameter[];
  file: IParameter[];
  files: IParameter[];
  header: IParameter[];
  headers: IParameter[];
  cookie: IParameter[];
  cookies: IParameter[];
}
