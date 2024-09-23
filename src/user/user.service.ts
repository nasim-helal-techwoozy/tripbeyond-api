import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UtilsService } from 'src/services/utils/utils.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
  ) {}

  /**======================REGISTER=========================== */
  public async register(user: CreateUserDto) {
    const { firstName, lastName, email, avatar, role, agent } = user;
    let { password } = user;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already taken! Try with new email');
    }

    if (!password) password = this.utilsService.generatePassword();

    const hashPassword = await this.utilsService.encryptPassword(password);

    return await this.createUser({
      email,
      password: hashPassword,
      firstName,
      lastName,
      avatar,
      role,
      agent,
    });
  }

  /**======================FIND USER BY EMAIL=========================== */
  public async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  public async createUser(user: any) {
    return await this.prisma.user.create({ data: user });
  }
}
