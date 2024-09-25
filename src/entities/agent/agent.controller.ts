import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UtilsService } from 'src/services/utils/utils.service';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/createAgent.dto';
import { LoginAgentDto } from './dto/loginAgent.dto';
import { ForgotPassAgentDto } from './dto/forgotPassAgent.dto';
import { UpdatePassAgentDto } from './dto/updatePassAgent.dto';
import { Roles } from 'src/modules/roles/roles.decorator';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { Role } from 'src/modules/roles/roles.enum';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly utilsService: UtilsService,
  ) {}
  /**==================AGENT REGISTER=============== */
  @Post('register')
  async register(@Body() agent: CreateAgentDto) {
    const registeredAgent = await this.agentService.register(agent);
    return this.utilsService.successResponse(
      'You are successfully registered as agent',
      { agent: registeredAgent },
    );
  }

  /**==================AGENT LOGIN=============== */
  @Post('login')
  @HttpCode(200)
  async login(@Body() agent: LoginAgentDto) {
    const token = await this.agentService.login(agent);

    return this.utilsService.successResponse(
      'You are successfully Logged in as agent',
      {
        token,
      },
    );
  }

  /**==================UPDATE AGENT PASSWORD =============== */

  @Roles(Role.AGENT, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Post('update-password')
  @HttpCode(200)
  async updatePassword(@Body() data: UpdatePassAgentDto) {
    await this.agentService.updatePassword(data);

    return this.utilsService.successResponse(
      'You password is successfully updated',
    );
  }

  /**==================AGENT FORGOT-PASSWORD =============== */
  @Roles(Role.AGENT, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() agent: ForgotPassAgentDto) {
    await this.agentService.forgotPassword(agent);

    return this.utilsService.successResponse(
      'You password is successfully updated',
      { anotherMessage: 'Please check your email for new password' },
    );
  }
}
