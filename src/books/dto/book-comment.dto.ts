// dto/book.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CommenOnBookDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @IsNumber()
  rating: number;

  @IsString()
  comment: string;
}
