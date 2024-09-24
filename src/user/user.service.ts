import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { CreateUserDto } from './dto/createUser.dto';
import { EmailService } from 'src/services/email/email.service';
import { emailTemplate } from 'src/services/email/email.template';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  /**======================USER REGISTER=========================== */
  public async register(user: CreateUserDto) {
    const { firstName, lastName, email, avatar } = user;
    let { password } = user;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already taken! Try with new email');
    }

    if (!password) password = this.utilsService.generatePassword();

    const hashPassword = await this.utilsService.encryptPassword(password);

    const createdUser = await this.createUser({
      email,
      password: hashPassword,
      firstName,
      lastName,
      avatar,
      role: 'USER',
    });

    delete createdUser.password;

    return createdUser;
  }

  /**=============================USER LOGIN======================================== */
  public async login(user: any) {
    const hasUser = await this.findUserByEmail(user.email);

    if (!hasUser) {
      throw new UnauthorizedException(
        'You are not register! Please registered first',
      );
    }

    const isPasswordMatched = await this.utilsService.comparePassword(
      user.password,
      hasUser.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException(
        'Credentials are not correct! please provide the correct credentials',
      );
    }

    const token = await this.authService.generateToken(hasUser);

    return token;
  }

  /**===============================UPDATE AGENT PASSWORD =================================*/
  public async updatePassword(data) {
    const hasUser = await this.findUserByEmail(data.email);
    if (!hasUser) {
      throw new NotFoundException(
        'User not found with your email. Use correct email or new one',
      );
    }

    const isPasswordMatched = await this.utilsService.comparePassword(
      data.password,
      hasUser.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('Your provided password is not correct');
    }

    const newHashedPassword = await this.utilsService.encryptPassword(
      data.newPassword,
    );

    //update pass to db
    await this.updateUserPassword(hasUser.email, newHashedPassword);
  }

  /**======================FIND USER BY EMAIL=========================== */
  public async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  public async createUser(user: any) {
    return await this.prisma.user.create({ data: user });
  }

  /**===============================UPDATE USER PASSWORD====================================== */
  public async updateUserPassword(email, hashedPassword) {
    // mainly change the user password that password is hold by user model
    return await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  /**===============================FORGOT PASSWORD USER====================================== */
  public async forgotPassword(user) {
    const hasUser = await this.findUserByEmail(user.email);
    if (!hasUser) {
      throw new NotFoundException('Agent not found with the provided ID.');
    }

    //generate password
    const newPassword = this.utilsService.generatePassword();

    const newHashedPassword =
      await this.utilsService.encryptPassword(newPassword);

    //update pass to db
    await this.updateUserPassword(user.email, newHashedPassword);

    //mail it
    await this.emailService.sendMail({
      to: [user.email, process.env.ADMIN_RECEIVER_EMAIL],
      subject: `Welcome to ${process.env.COMPANY_NAME}! Your password is updated`,
      html: emailTemplate({
        agent: `${hasUser.firstName} ${hasUser.lastName}`,
        companyName: process.env.COMPANY_NAME,
        agentID: hasUser.email,
        password: newPassword,
        senderEmail: process.env.SENDER_EMAIL,
        titleLabel: 'Email',
        passwordLabel: 'Your Updated Password',
        headingName:
          'We are excited to inform you that your password is updated successfully',
        loginLink: 'https://tripbeyond.com/signin/user',
      }),
    });

    return newHashedPassword;
  }
}
