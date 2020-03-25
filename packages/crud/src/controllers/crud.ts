import { Response } from 'express';
import { HttpStatus } from '@leapjs/common';
import buildResultWithPagination from 'src/utils/pagination';
import CrudService from '../services/crud';

class CrudController<T> {
  private service!: CrudService<T>;

  constructor(service: CrudService<T>) {
    this.service = service;
  }

  public async createOne(data: T, res: Response): Promise<Response> {
    const savedData = await this.service.createOne(data);
    return res
      .status(HttpStatus.CREATED)
      .json({ data: { role: { _id: savedData._id } } });
  }

  public async createMany(data: T[], res: Response): Promise<Response> {
    const savedData = await this.service.createMany(data);
    return res.status(HttpStatus.CREATED).json({ data: { roles: savedData } });
  }

  public async replaceOne(
    id: string,
    data: T,
    res: Response,
  ): Promise<Response> {
    const updatedData = await this.service.replaceOne({ _id: id }, data);
    return res.status(HttpStatus.OK).json({ data: { role: updatedData } });
  }

  public async updateOne(
    id: string,
    data: Partial<T>,
    res: Response,
  ): Promise<Response> {
    const updatedData = await this.service.updateOne({ _id: id }, data);
    return res.status(HttpStatus.OK).json({ data: { role: updatedData } });
  }

  public async getOne(
    id: string,
    fields: string,
    res: Response,
  ): Promise<Response> {
    const data = await this.service.getOne({ _id: id }, fields);
    return res.status(HttpStatus.OK).json({ data: { role: data } });
  }

  public async getMany(
    fields: string,
    sort = 'id|asc',
    page = 0,
    perPage = 10,
    res: Response,
  ): Promise<Response> {
    let sortByArr = sort.split('|');
    if (!['asc', 'desc'].includes(sortByArr[1])) {
      sortByArr = ['id', 'asc'];
    }
    const data = await this.service.getMany(
      sortByArr,
      {},
      fields,
      page,
      perPage,
    );
    return res
      .status(HttpStatus.OK)
      .json(buildResultWithPagination('roles', data, page, perPage));
  }

  public async deleteOne(id: string, req: any, res: Response): Promise<void> {
    await this.service.deleteOne(id);
    return res.status(HttpStatus.NO_CONTENT).end();
  }
}

export default CrudController;
