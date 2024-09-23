import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsPhoneNumber,
} from 'class-validator';

export class CreateAgentDto {
  @IsInt()
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

  @IsPhoneNumber(null) // Adjust with a specific region if needed
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
}
