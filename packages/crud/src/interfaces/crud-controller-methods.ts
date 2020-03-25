export interface ICrudControllerMethods {
  createOne: [string, { before?: any[]; after?: any[] }?] | boolean;
  createMany: [string, { before?: any[]; after?: any[] }?] | boolean;
  updateOne: [string, { before?: any[]; after?: any[] }?] | boolean;
  replaceOne: [string, { before?: any[]; after?: any[] }?] | boolean;
  getOne: [string, { before?: any[]; after?: any[] }?] | boolean;
  getMany: [string, { before?: any[]; after?: any[] }?] | boolean;
  deleteOne: [string, { before?: any[]; after?: any[] }?] | boolean;
}
