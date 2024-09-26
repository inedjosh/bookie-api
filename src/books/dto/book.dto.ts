// dto/book.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
} from 'class-validator';
import { BOOK_GENRE } from 'src/constants';

export class BookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  book_image_url: string;

  @IsNotEmpty()
  book_url: string;

  @IsEnum({ BOOK_GENRE })
  genre: BOOK_GENRE;

  @IsOptional()
  @IsString()
  description?: string;
}
