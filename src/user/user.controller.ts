import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UtilsService } from 'src/services/utils/utils.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserService } from './user.service';
import { UpdatePassUserDto } from './dto/updatePassUser.dto';
import { ForgotPassUserDto } from './dto/forgotPassUser.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Authenticated } from 'src/auth/auth.decorator';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
  ) {}

  /**==================USER REGISTER =============== */
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const registeredUser = await this.userService.register(user);

    return this.utilsService.successResponse(
      'You are successfully register as user',
      {
        user: registeredUser,
      },
    );
  }

  /**==================USER LOGIN =============== */
  @Post('login')
  @HttpCode(200)
  async login(@Body() agent: LoginUserDto) {
    const token = await this.userService.login(agent);
    return this.utilsService.successResponse(
      'You are successfully Logged in as a user',
      {
        token,
      },
    );
  }

  /**==================UPDATE USER PASSWORD =============== */
  @Post('update-password')
  @Authenticated()
  @Roles(Role.AGENT)
  @HttpCode(200)
  async updatePassword(@Body() data: UpdatePassUserDto) {
    await this.userService.updatePassword(data);

    return this.utilsService.successResponse(
      'You password is successfully updated',
    );
  }

  /**==================USER FORGOT-PASSWORD =============== */
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() user: ForgotPassUserDto) {
    await this.userService.forgotPassword(user);

    return this.utilsService.successResponse(
      'You password is successfully updated',
      { anotherMessage: 'Please check your email for new password' },
    );
  }
}
