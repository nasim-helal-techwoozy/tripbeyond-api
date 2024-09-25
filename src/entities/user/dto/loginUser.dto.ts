import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;
}
