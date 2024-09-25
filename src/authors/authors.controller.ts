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
  async getAllAuthors(): Promise<ApiResponse<Author[]>> {
    return this.authorService.getAllAuthors();
  }

  @Get(':id')
  async getAuthorById(
    @Param('id') userId: string,
  ): Promise<ApiResponse<Author>> {
    return this.authorService.getAuthorById(userId);
  }

  @Put(':id')
  async updateAuthor(
    @Param('id') authorId: string,
    @Body() authorData: AuthorDto,
  ): Promise<ApiResponse<Author>> {
    return this.authorService.updateAuthor(authorId, authorData);
  }

  @Delete(':id')
  async deleteAuthor(
    @Param('id') authorId: string,
    @Req() req,
  ): Promise<ApiResponse<void>> {
    return this.authorService.deleteAuthor(authorId, req.user.id);
  }
}
