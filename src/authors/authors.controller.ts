import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
} from '@nestjs/common';
import { AuthorService } from './authors.service';
import { Author } from './schema/author.schema';
import { AuthorDto } from './dto/creat-author.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('v1/authors')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  async createAuthor(
    @Body() authorData: AuthorDto,
    @Req() req,
  ): Promise<ApiResponse<Author>> {
    return this.authorService.createAuthor(authorData, req.user.id);
  }

  @Get()
  async getAllAuthors(@Query() query: any): Promise<
    ApiResponse<{
      authors: Author[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>
  > {
    const { filter, page } = query;

    return this.authorService.getAllAuthors(filter, page);
  }

  @Get(':id')
  async getAuthorById(
    @Param('id') userId: string,
  ): Promise<ApiResponse<Author>> {
    return this.authorService.getAuthorById(userId);
  }

  @Put()
  async updateAuthor(
    @Req() req,
    @Body() authorData: AuthorDto,
  ): Promise<ApiResponse<Author>> {
    return this.authorService.updateAuthor(req.user.id, authorData);
  }

  @Delete(':id')
  async deleteAuthor(
    @Param('id') authorId: string,
    @Req() req,
  ): Promise<ApiResponse<void>> {
    return this.authorService.deleteAuthor(authorId, req.user.id);
  }

  @Get('search/authors')
  async searchAuthors(
    @Query('query') query: string,
    @Query('genres') genres: string[],
    @Query('rating') rating: number,
  ): Promise<
    ApiResponse<{
      authors: Author[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>
  > {
    const filters = {
      genres,
      rating,
    };
    return this.authorService.searchAuthors(query, filters);
  }
}
