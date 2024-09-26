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

  async findAll(
    filter: any,
    page: number,
    pageSize = 20,
  ): Promise<{
    authors: Author[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const totalItems = await this.authorModel.countDocuments(filter);
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.authorModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
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

    return {
      authors: data,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems,
    };
  }

  async findById(authorId: string): Promise<Author> {
    return await this.authorModel
      .findById(authorId)
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
