/* The `RolesGuard` class in TypeScript is a NestJS guard that checks the roles of authenticated users
to control access to specific routes based on their permissions. */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // If @Auth is not applied, allow access
    }

    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new ForbiddenException('You are not authenticated');
    }

    const token = authHeader.split(' ')[1]; // assuming 'Bearer <token>'

    if (!token) {
      throw new ForbiddenException('You are not authenticated');
    }

    try {
      request.user = this.jwtService.verify(token);
      let data = request.user;
      if (request.user.user) data = request.user.user;

      //write all logic in here based on data
      const dbUser = await this.prisma.user.findFirst({
        where: { id: data.id },
      });

      if (dbUser.role === data.role) {
        return roles.includes(data.role);
      } else {
        return false;
      }
    } catch {
      throw new ForbiddenException('Permission Denied');
    }
  }
}
