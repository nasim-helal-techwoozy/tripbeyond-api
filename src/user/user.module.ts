import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from 'src/services/email/email.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UtilsService,
    AuthService,
    EmailService,
  ],
})
export class UserModule {}
