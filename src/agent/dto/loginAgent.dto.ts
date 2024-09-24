import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginAgentDto {
  @IsInt()
  @IsOptional()
  agentID: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
