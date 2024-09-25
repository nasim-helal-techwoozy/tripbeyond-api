import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  USER = 'USER', // Add other roles as needed
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.AGENT;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
