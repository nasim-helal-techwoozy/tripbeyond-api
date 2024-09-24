import { IsEmail } from 'class-validator';

export class ForgotPassUserDto {
  @IsEmail()
  email: string;
}
