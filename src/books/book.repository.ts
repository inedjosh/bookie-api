import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { ICreateBook } from './interface/books.interface';
import { ICreateReview } from './interface/comment.interface';
import { Review, ReviewDocument } from './schema/comments.schema';

@Injectable()
export class BookRepository {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(bookData: ICreateBook): Promise<BookDocument> {
    return await this.bookModel.create(bookData);
  }

  async createComment(bookData: ICreateReview): Promise<ReviewDocument> {
    return await this.reviewModel.create(bookData);
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
        select: 'first_name last_name username profile_url role email',
      })
      .populate({
        path: 'author',
        select: 'bio',
      })
      .populate({
        path: 'reviews',
        select: 'rating comment',
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
        select: 'first_name last_name username profile_url role email',
      })
      .populate({
        path: 'author',
        select: 'bio',
      })
      .populate({
        path: 'reviews',
        select: 'rating comment',
      })
      .exec();
  }

  async findBooksByReader(userId: Types.ObjectId): Promise<Book[]> {
    return this.bookModel.find({ readers: userId }).exec();
  }

  async update(bookId: string, bookData: Partial<ICreateBook>): Promise<Book> {
    return await this.bookModel
      .findByIdAndUpdate(bookId, { $set: bookData }, { new: true })
      .exec();
  }

  async delete(bookId: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(bookId).exec();
  }
}
