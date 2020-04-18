import { Response } from 'express';
import { HttpStatus } from '@leapjs/common';
import pluralize from 'pluralize';
import buildResultWithPagination from '../utils/pagination';
import CrudService from '../services/crud';

class CrudController<T> {
  private service!: CrudService<T>;
  private singularModelName!: string;
  private pluralModelName!: string;

  constructor(service: CrudService<T>) {
    this.service = service;
    this.singularModelName = Object.values(
      this.service.getModelName(),
    )[2].toLowerCase();
    this.pluralModelName = pluralize(this.singularModelName);
  }

  public async createOne(data: T, res: Response): Promise<Response> {
    const savedData = await this.service.createOne(data);
    const result = { data: {} };
    result.data[this.singularModelName] = { _id: savedData._id };
    return res.status(HttpStatus.CREATED).json(result);
  }

  public async createMany(data: T[], res: Response): Promise<Response> {
    const savedData = await this.service.createMany(data);
    const result = { data: {} };
    result.data[this.pluralModelName] = savedData;
    return res.status(HttpStatus.CREATED).json(result);
  }

  public async replaceOne(
    id: string,
    data: T,
    res: Response,
  ): Promise<Response> {
    const updatedData = await this.service.replaceOne({ _id: id }, data);
    const result = { data: {} };
    result.data[this.singularModelName] = updatedData;
    return res.status(HttpStatus.OK).json(result);
  }

  public async updateOne(
    id: string,
    data: Partial<T>,
    res: Response,
  ): Promise<Response> {
    const updatedData = await this.service.updateOne({ _id: id }, data);
    const result = { data: {} };
    result.data[this.singularModelName] = updatedData;
    return res.status(HttpStatus.OK).json(result);
  }

  public async getOne(
    id: string,
    fields: string,
    expand: string,
    res: Response,
  ): Promise<Response> {
    const data = await this.service.getOne({ _id: id }, fields, expand);
    const result = { data: {} };
    result.data[this.singularModelName] = data;
    return res.status(HttpStatus.OK).json(result);
  }

  public async getMany(
    fields: string,
    expand: string,
    sort = 'id|asc',
    page: number,
    perPage: number,
    res: Response,
  ): Promise<Response> {
    let sortByArr = sort.split('|');
    if (!['asc', 'desc'].includes(sortByArr[1])) {
      sortByArr = ['id', 'asc'];
    }
    let offset = page;
    let limit = 10;

    if (page) {
      offset = Number(page);
    }
    if (perPage) {
      limit = Number(perPage);
    }

    const data = await this.service.getMany(
      sortByArr,
      {},
      fields,
      offset,
      limit,
      expand,
    );
    return res
      .status(HttpStatus.OK)
      .json(
        buildResultWithPagination(this.pluralModelName, data, offset, limit),
      );
  }

  public async deleteOne(id: string, res: Response): Promise<void> {
    await this.service.deleteOne(id);
    return res.status(HttpStatus.NO_CONTENT).end();
  }
}

export default CrudController;
