export interface IParameter {
  name: string;
  index: number;
  type: Function;
}

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

export interface IAttributes {
  httpMethod: string;
  route: string;
  method: Function;
  methodParams: IMethodParams;
}

export interface IController {
  class: Function;
  baseRoute: string;
  attributes: IAttributes[];
}
