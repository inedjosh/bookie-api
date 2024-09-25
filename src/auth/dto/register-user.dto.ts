import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { transformToLowerCase, trimWhiteSpace } from '../utils/transformations';
import { ACCOUNT_TYPE } from '../../constants';

export class RegisterUserDataDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  password: string;

  @Transform(({ value }) => trimWhiteSpace(value))
  @Transform(({ value }) => transformToLowerCase(value))
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
