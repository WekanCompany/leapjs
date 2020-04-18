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

  public getModelName(): Model<Document> {
    return this.model;
  }

  public async createOne(data: T): Promise<Document> {
    // eslint-disable-next-line new-cap
    return new this.model(data).save();
  }

  public async createMany(data: T[]): Promise<Document[]> {
    return this.model.insertMany(data);
  }

  public async replaceOne(query: {}, data: T): Promise<Document> {
    return this.updateOne(query, data);
  }

  public async updateOne(query: {}, data: Partial<T>): Promise<Document> {
    const result = await this.model
      .findOneAndUpdate(query, data, { fields: this.updateFields, new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`${this.model.modelName} not found`);
    }
    return result;
  }

  public async getOne(
    query?: {},
    fields?: string,
    populate?: string,
  ): Promise<Record<string, any>> {
    const filter = query !== undefined ? query : {};
    const result = await this.model
      .findOne(filter)
      .select(
        fields !== undefined ? fields.replace(/,/g, ' ') : this.defaultFields,
      )
      .populate(populate)
      .lean()
      .exec();
    if (!result) {
      throw new NotFoundException(`${this.model.modelName} not found`);
    }
    return result;
  }

  public async getMany(
    sort: string[],
    query?: {},
    fields?: string,
    offset?: number,
    limit?: number,
    populate?: string,
  ): Promise<[Record<string, any>[], number]> {
    const filter = query !== undefined ? query : {};
    const sortby: any = {};
    // eslint-disable-next-line prefer-destructuring
    sortby[sort[0]] = sort[1];

    const result = await this.model
      .find(
        filter,
        fields !== undefined ? fields.replace(/,/g, ' ') : this.defaultFields,
        { skip: offset, limit, sort: sortby },
      )
      .populate(populate !== undefined ? populate.replace(/,/g, ' ') : '')
      .lean()
      .exec();
    const count = await this.model.countDocuments(filter).exec();
    return [result, count];
  }

  public async deleteOne(id: any): Promise<IDeleteResponse> {
    const result: IDeleteResponse = await this.model
      .deleteOne({ _id: id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`${this.model.modelName} not found`);
    }
    return result;
  }
}

export default CrudService;
