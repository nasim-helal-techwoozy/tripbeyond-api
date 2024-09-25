import { Module } from '@nestjs/common';
import { EmailService } from 'src/services/email/email.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AgentController],
  providers: [
    AgentService,
    PrismaService,
    UtilsService,
    EmailService,
    AuthService,
  ],
})
export class AgentModule {}
