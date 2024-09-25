import { Module } from '@nestjs/common';
import { AdminModule } from './entities/admin/admin.module';
import { AgentModule } from './entities/agent/agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, AgentModule, AuthModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
