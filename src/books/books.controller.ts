import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { BookService } from './books.service';
import { Book } from './schema/book.schema';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BookDto } from './dto/book.dto';

@UseGuards(AuthGuard)
@Controller('v1/books')
@UsePipes(new ValidationPipe({ transform: true }))
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createBook(
    @Body() bookData: BookDto,
    @Req() req,
  ): Promise<ApiResponse<Book>> {
    return this.bookService.createBook(bookData, req.user.id);
  }

  @Get()
  async getBooks(@Query() query: any): Promise<
    ApiResponse<{
      books: Book[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>
  > {
    const { filter, page } = query;
    return this.bookService.getBooks(filter, page);
  }

  @Get(':id')
  async getBookById(@Param('id') bookId: string): Promise<ApiResponse<Book>> {
    return this.bookService.getBookById(bookId);
  }

  @Put(':id')
  async updateBook(
    @Param('id') bookId: string,
    @Body() bookData: Partial<BookDto>,
    @Req() req,
  ): Promise<ApiResponse<Book>> {
    return this.bookService.updateBook(bookId, bookData, req.user.id);
  }

  @Delete(':id')
  async deleteBook(@Param('id') bookId: string): Promise<ApiResponse<void>> {
    return this.bookService.deleteBook(bookId);
  }

  @Get('genres')
  async getGenres(): Promise<ApiResponse<any>> {
    return this.bookService.getGenres(bookId);
  }
}
