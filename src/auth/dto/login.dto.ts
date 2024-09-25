import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  email: string;
}
