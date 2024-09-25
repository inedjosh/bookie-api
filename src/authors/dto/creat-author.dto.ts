// dto/create-author.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AuthorDto {
  @IsOptional()
  @IsString()
  bio: string;
}
