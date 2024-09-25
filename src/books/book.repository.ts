import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { ICreateBook } from './interface/books.interface';

@Injectable()
export class BookRepository {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(bookData: ICreateBook): Promise<BookDocument> {
    return await this.bookModel.create(bookData);
  }

  async findAll(
    filter: any,
    page: number,
    pageSize = 20,
  ): Promise<{
    books: Book[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const totalItems = await this.bookModel.countDocuments(filter);
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.bookModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'user',
        select: 'first_name last_name username',
      })
      .populate({
        path: 'author',
        select: 'bio',
      })
      .exec();

    return {
      books: data,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems,
    };
  }

  async findById(bookId: string): Promise<Book> {
    return await this.bookModel
      .findById(bookId)
      .populate({
        path: 'user',
        select: 'first_name last_name username',
      })
      .populate({
        path: 'author',
        select: 'bio',
      })
      .exec();
  }

  async update(bookId: string, bookData: Partial<ICreateBook>): Promise<Book> {
    return await this.bookModel
      .findByIdAndUpdate(bookId, bookData, { new: true })
      .exec();
  }

  async delete(bookId: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(bookId).exec();
  }
}
