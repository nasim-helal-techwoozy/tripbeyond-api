import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UtilsService } from 'src/services/utils/utils.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ForgotPassUserDto } from './dto/forgotPassUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdatePassUserDto } from './dto/updatePassUser.dto';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';

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
      { user: registeredUser },
    );
  }

  /**==================USER LOGIN =============== */
  @Post('login')
  @HttpCode(200)
  async login(@Body() agent: LoginUserDto) {
    const token = await this.userService.login(agent);
    return this.utilsService.successResponse(
      'You are successfully Logged in as a user',
      { token },
    );
  }

  /**==================UPDATE USER PASSWORD =============== */
  @Roles(Role.USER, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Post('update-password')
  @HttpCode(200)
  async updatePassword(@Body() data: UpdatePassUserDto) {
    await this.userService.updatePassword(data);

    return this.utilsService.successResponse(
      'You password is successfully updated',
    );
  }

  /**==================USER FORGOT-PASSWORD =============== */
  @Roles(Role.USER, Role.MODERATOR)
  @UseGuards(RolesGuard)
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
