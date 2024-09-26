// dto/book.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ReadBookDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;
}
