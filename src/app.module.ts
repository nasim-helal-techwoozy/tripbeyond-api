import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './services/prisma/prisma.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AgentModule, AuthModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
