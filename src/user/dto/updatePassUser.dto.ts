import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePassUserDto {
  @IsEmail()
  email: number;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
