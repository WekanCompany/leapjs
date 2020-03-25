import { NotFoundException } from '@leapjs/common';
import { Document, Model } from 'mongoose';
import { IDeleteResponse } from '../interfaces/deleted-response';

class CrudService<T> {
  private model: Model<Document>;
  private updateFields!: any;
  private defaultFields!: string;

  public constructor(
    model: Model<T & Document>,
    defaultFields: string,
    updateFields: any,
  ) {
    this.model = model;
    this.defaultFields = defaultFields;
    this.updateFields = updateFields;
  }

  public async createOne(data: T): Promise<any> {
    // eslint-disable-next-line new-cap
    return new this.model(data)
      .save()
      .then((result: Document): Document => result)
      .catch((error: any): Promise<any> => Promise.reject(error));
  }

  public async createMany(data: T[]): Promise<any> {
    return this.model
      .insertMany(data)
      .then((result: Document[]): Document[] => result)
      .catch((error: any): Promise<any> => Promise.reject(error));
  }

  public async replaceOne(query: {}, data: T): Promise<any> {
    return this.updateOne(query, data);
  }

  public async updateOne(query: {}, data: Partial<T>): Promise<any> {
    return this.model
      .findOneAndUpdate(query, data, { fields: this.updateFields, new: true })
      .exec()
      .then((result: any): {} => {
        if (!result) {
          throw new NotFoundException(`${this.model.modelName} not found`);
        }
        return result;
      })
      .catch((error: any): any => Promise.reject(error));
  }

  public async getOne(
    query?: {},
    fields?: string,
    populate?: string,
  ): Promise<any> {
    const filter = query !== undefined ? query : {};
    return this.model
      .findOne(filter)
      .select(
        fields !== undefined ? fields.replace(/,/g, ' ') : this.defaultFields,
      )
      .populate(populate)
      .lean()
      .exec()
      .then(
        (result: any): Partial<T> => {
          if (!result) {
            throw new NotFoundException(`${this.model.modelName} not found`);
          }
          return result;
        },
      )
      .catch((error: any): Promise<any> => Promise.reject(error));
  }

  public async getMany(
    sort: string[],
    query?: {},
    fields?: string,
    offset?: number,
    limit?: number,
    populate?: string,
  ): Promise<any> {
    const filter = query !== undefined ? query : {};

    const sortby: any = {};
    // eslint-disable-next-line prefer-destructuring
    sortby[sort[0]] = sort[1];

    return this.model
      .find(
        filter,
        fields !== undefined ? fields.replace(/,/g, ' ') : this.defaultFields,
        { skip: offset, limit, sort: sortby },
      )
      .populate(populate !== undefined ? populate.replace(/,/g, ' ') : '')
      .lean()
      .exec()
      .then(
        async (result: any[]): Promise<[T[], number]> => {
          const count = await this.model.countDocuments(filter).exec();
          return [result, count];
        },
      )
      .catch((error: any): Promise<any> => Promise.reject(error));
  }

  public async deleteOne(id: any): Promise<IDeleteResponse> {
    return this.model
      .deleteOne({ _id: id })
      .exec()
      .then(
        (result: IDeleteResponse): IDeleteResponse => {
          if (result.deletedCount === 0) {
            throw new NotFoundException(`${this.model.modelName} not found`);
          }
          return result;
        },
      )
      .catch((error: any): Promise<any> => Promise.reject(error));
  }
}

export default CrudService;
