import { Injectable } from '@nestjs/common';
import { AuthorRepository } from './author.repository';
import { Author } from './schema/author.schema';
import { AuthorDto } from './dto/creat-author.dto';
import { Types } from 'mongoose';
import { UserRepository } from '../users/user.repository';
import { ACCOUNT_TYPE } from '../constants';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class AuthorService {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createAuthor(
    authorData: AuthorDto,
    user_id: string,
  ): Promise<ApiResponse<Author>> {
    const author = await this.authorRepository.create({
      bio: authorData.bio,
      user: new Types.ObjectId(user_id),
      genres: authorData.genres,
      pen_name: authorData.pen_name,
    });

    await this.userRepository.findByIdAndUpdate(user_id, {
      role: ACCOUNT_TYPE.AUTHOR,
    });

    return {
      message: 'Author created successfully',
      data: author,
      status: true,
    };
  }

  async getAllAuthors(): Promise<ApiResponse<Author[]>> {
    const authors = await this.authorRepository.findAll();
    return {
      message: 'Authors retrieved successfully',
      data: authors,
      status: true,
    };
  }

  async getAuthorById(authorId: string): Promise<ApiResponse<Author>> {
    const author = await this.authorRepository.findById(authorId);
    return {
      message: 'Author retrieved successfully',
      data: author,
      status: true,
    };
  }

  async updateAuthor(
    authorId: string,
    authorData: AuthorDto,
  ): Promise<ApiResponse<Author>> {
    const updatedAuthor = await this.authorRepository.update(
      authorId,
      authorData,
    );
    return {
      message: 'Author updated successfully',
      data: updatedAuthor,
      status: true,
    };
  }

  async deleteAuthor(
    authorId: string,
    user_id: string,
  ): Promise<ApiResponse<void>> {
    await this.authorRepository.delete(authorId);

    await this.userRepository.findByIdAndUpdate(user_id, {
      role: ACCOUNT_TYPE.READER,
    });

    return { message: 'Author deleted successfully', data: null, status: true };
  }
}
