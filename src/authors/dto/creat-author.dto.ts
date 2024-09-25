// dto/create-author.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class AuthorDto {
  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  pen_name: string;

  @IsNotEmpty()
  @IsArray()
  genres: string[];
}
