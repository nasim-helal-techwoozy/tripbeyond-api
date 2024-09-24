import { IsEmail, IsInt, IsOptional } from 'class-validator';

export class ForgotPassAgentDto {
  @IsInt()
  @IsOptional()
  agentID: number;

  @IsEmail()
  email: string;
}
