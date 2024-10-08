import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { Book, BookDocument } from './schema/book.schema';
import { BookDto } from './dto/book.dto';
import { ACCOUNT_TYPE } from '../constants';
import { UserRepository } from '../users/user.repository';
import { AuthorRepository } from '../authors/author.repository';
import { CommenOnBookDto } from './dto/book-comment.dto';
import { Types } from 'mongoose';
import { ReviewDocument } from './schema/comments.schema';
import { ReadBookDto } from './dto/read-book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly authorRepository: AuthorRepository,
  ) {}

  async createBook(
    bookData: BookDto,
    user_id: string,
  ): Promise<ApiResponse<Book>> {
    const user = await this.userRepository.getById(user_id);
    const author = await this.authorRepository.findOne({ user: user._id });

    if (user.role !== ACCOUNT_TYPE.AUTHOR)
      throw new BadRequestException('Only authors can upload books');

    const book = await this.bookRepository.create({
      ...bookData,
      published_date: new Date(),
      author: author._id,
      user: user._id,
      reviews: [],
      readers: [],
    });

    const authorsBooks = [...author.books, book._id];

    await this.authorRepository.update(
      { user: user._id },
      { books: authorsBooks },
    );
    return {
      message: 'Your Book has been created successfully',
      data: book,
      status: true,
    };
  }

  async getBooks(
    filter: any,
    page: number,
  ): Promise<
    ApiResponse<{
      books: Book[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>
  > {
    const books = await this.bookRepository.findAll(filter, page);
    return {
      message: 'Books retrieved successfully',
      data: books,
      status: true,
    };
  }

  async getBookById(bookId: string): Promise<ApiResponse<Book>> {
    const book = await this.bookRepository.findById(bookId);
    return { message: 'Book retrieved successfully', data: book, status: true };
  }

  async updateBook(
    bookId: string,
    bookData: Partial<BookDto>,
    user_id: string,
  ): Promise<ApiResponse<Book>> {
    const book = await this.bookRepository.findById(bookId);

    if (book.user.id.toString() !== user_id)
      throw new BadRequestException('You can only edit your own book');

    const updatedBook = await this.bookRepository.update(bookId, bookData);

    return {
      message: 'Book updated successfully',
      data: updatedBook,
      status: true,
    };
  }

  async deleteBook(bookId: string): Promise<ApiResponse<void>> {
    await this.bookRepository.delete(bookId);
    return { message: 'Book deleted successfully', data: null, status: true };
  }

  async reviewBook(
    reviewData: CommenOnBookDto,
    user_id: string,
  ): Promise<ApiResponse<ReviewDocument>> {
    const book = await this.bookRepository.findById(reviewData.bookId);

    const user = await this.userRepository.getById(user_id);

    const comment = await this.bookRepository.createComment({
      user: new Types.ObjectId(user_id),
      rating: reviewData.rating,
      comment: reviewData.comment,
      book: new Types.ObjectId(reviewData.bookId),
      profile_url: user.profile_url,
      name: `${user.first_name} ${user.last_name}`,
    });

    await this.bookRepository.addReviewToBook(reviewData.bookId, comment._id);

    return {
      message: 'Book reviewed successfully',
      data: comment,
      status: true,
    };
  }

  async readBook(data: ReadBookDto, userId: string): Promise<ApiResponse<any>> {
    const book = await this.bookRepository.findById(data.bookId);

    await this.bookRepository.update(data.bookId, {
      readers: [...book.readers, new Types.ObjectId(userId)],
    });

    return {
      message: 'Book added to your library successfully',
      data: {},
      status: true,
    };
  }

  async myLibrary(userId: string): Promise<ApiResponse<any>> {
    const library = await this.bookRepository.findBooksByReader(
      new Types.ObjectId(userId),
    );

    return {
      message: 'My Library retrieved successfully',
      data: library,
      status: true,
    };
  }

  async searchBooks(
    query: string,
    filter: any,
  ): Promise<
    ApiResponse<{
      books: Book[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>
  > {
    const books = await this.bookRepository.searchBooks(query, filter);

    return {
      message: 'Search successfully',
      data: books,
      status: true,
    };
  }
}
