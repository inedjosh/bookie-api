import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from './schema/author.schema';
import { ICreateAuthor } from './interface/author.interface';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(authorData: ICreateAuthor): Promise<Author> {
    return await this.authorModel.create(authorData);
  }

  async findAll(): Promise<Author[]> {
    return this.authorModel
      .find()
      .populate({
        path: 'user',
        select: 'first_name last_name username role email profile_url',
      })
      .populate({ path: 'books', select: 'title' })
      .exec();
  }

  async findById(authorId: string): Promise<Author> {
    return await this.authorModel
      .findById(authorId)
      .populate({
        path: 'user',
        select: 'first_name last_name username role email profile_url',
      })
      .populate({ path: 'books', select: 'title' })
      .exec();
  }

  async findOne(query: any): Promise<AuthorDocument> {
    return await this.authorModel
      .findOne(query)
      .populate({
        path: 'user',
        select: 'first_name last_name username role email profile_url',
      })
      .populate({
        path: 'books',
        select:
          'title description genre book_url published_date book_image_url genre book_url',
      })
      .exec();
  }

  async update(query: any, updateData: Partial<Author>): Promise<Author> {
    return await this.authorModel
      .findOneAndUpdate(query, { $set: updateData }, { new: true })
      .exec();
  }

  async delete(authorId: string): Promise<Author> {
    return await this.authorModel.findByIdAndDelete(authorId).exec();
  }
}
