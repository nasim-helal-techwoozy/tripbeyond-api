import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/entities/user/dto/createUser.dto';

export class CreateAgentDto {
  @IsInt()
  @IsOptional()
  agentID: number;

  @IsString()
  @IsNotEmpty()
  orgType: string;

  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsOptional()
  @IsString()
  orgAddress?: string;

  @IsOptional()
  @IsString()
  docs?: string; // URL for docs (AWS S3)

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
