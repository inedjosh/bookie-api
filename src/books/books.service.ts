import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { Book } from './schema/book.schema';
import { BookDto } from './dto/book.dto';
import { ACCOUNT_TYPE } from '../constants';
import { UserRepository } from '../users/user.repository';
import { AuthorRepository } from '../authors/author.repository';

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
      publishedDate: new Date(),
      author: author._id,
      user: user._id,
    });

    const authorsBooks = [...author.books, book._id];

    await this.authorRepository.update(
      { user: user._id },
      { books: authorsBooks },
    );
    return { message: 'Book created successfully', data: book, status: true };
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
}
