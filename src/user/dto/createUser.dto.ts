import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDate,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAgentDto } from 'src/agent/dto/createAgent.dto';

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAgentDto)
  agent: CreateAgentDto;

  @IsOptional()
  Agent?: string; // Replace with proper DTO or ID type if needed
}
