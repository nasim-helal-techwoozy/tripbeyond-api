import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { EmailService } from 'src/services/email/email.service';
import { emailTemplate } from 'src/services/email/email.template';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UtilsService } from 'src/services/utils/utils.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  /**=============================REGISTER AGENT======================================== */
  public async register(agent: any) {
    const { user, ...agentData } = agent;

    const existingAgent = await this.findAgentByEmail(user.email);
    if (existingAgent) {
      throw new BadRequestException(
        'Email has already taken! Try with another email',
      );
    }

    if (!user.password) {
      user.password = this.utilsService.generatePassword();
    }

    const hashedPassword = await this.utilsService.encryptPassword(
      user.password,
    );

    // Create the agent and include user data
    const createdAgent = await this.createAgent(
      agentData,
      user,
      hashedPassword,
    );

    // Flatten user properties into the agent object
    const { user: userData, ...restAgentData } = createdAgent;

    // send agentID, password to the agent gmail
    await this.emailService.sendMail({
      to: [userData.email, process.env.ADMIN_RECEIVER_EMAIL],
      subject: `Welcome to ${process.env.COMPANY_NAME}! Your Registration Successful`,
      html: emailTemplate({
        agent: createdAgent,
        companyName: process.env.COMPANY_NAME,
        agentID: createdAgent.agentID,
        password: user.password,
        senderEmail: process.env.SENDER_EMAIL,
        titleLabel: 'Your Agent ID',
        passwordLabel: 'Password',
        headingName:
          'We are excited to inform you that your registration was successful!',
        loginLink: 'https://tripbeyond.com/signin/agent',
      }),
    });

    // Remove password from the user object
    delete userData.password;

    return {
      ...restAgentData, // Agent properties
      ...userData, // User properties
    };
  }

  /**=============================LOGIN AGENT======================================== */
  public async login(agent: any) {
    const hasAgent = await this.findAgentByAgentID(agent.agentID);

    if (!hasAgent) {
      throw new UnauthorizedException(
        'You are not register! Please registered first',
      );
    }

    const isPasswordMatched = await this.utilsService.comparePassword(
      agent.password,
      hasAgent.user.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException(
        'Credentials are not correct! please provide the correct credentials',
      );
    }

    const token = await this.authService.generateToken(hasAgent);

    return token;
  }

  /**===============================REGISTER AGENT====================================== */
  public async createAgent(agentData: any, user: any, hashedPassword: string) {
    return await this.prisma.agent.create({
      data: {
        agentID: agentData.agentID,
        orgType: agentData.orgType,
        orgName: agentData.orgName,
        country: agentData.country,
        state: agentData.state,
        city: agentData.city,
        phoneNumber: agentData.phoneNumber,
        zipCode: agentData.zipCode,
        orgAddress: agentData.orgAddress,
        docs: agentData.docs,
        user: {
          create: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            role: 'AGENT',
          },
        },
      },
      include: { user: true },
    });
  }

  /**===============================FORGOT PASSWORD AGENT====================================== */
  public async forgotPassword(agent) {
    const hasAgent = await this.findAgentByAgentID(agent.agentID);
    if (!hasAgent) {
      throw new NotFoundException('Agent not found with the provided ID.');
    }

    if (hasAgent.user.email !== agent.email) {
      throw new BadRequestException(
        'The provided email does not match the registered email for this agent.',
      );
    }

    //generate password
    const newPassword = this.utilsService.generatePassword();

    const newHashedPassword =
      await this.utilsService.encryptPassword(newPassword);

    //update pass to db
    await this.updateAgentPassword(hasAgent.user.id, newHashedPassword);

    //mail it
    await this.emailService.sendMail({
      to: [agent.email, process.env.ADMIN_RECEIVER_EMAIL],
      subject: `Welcome to ${process.env.COMPANY_NAME}! Your password is updated`,
      html: emailTemplate({
        agent: hasAgent.orgName,
        companyName: process.env.COMPANY_NAME,
        agentID: hasAgent.agentID,
        password: newPassword,
        senderEmail: process.env.SENDER_EMAIL,
        titleLabel: 'Your Agent ID',
        passwordLabel: 'Your Updated Password',
        headingName:
          'We are excited to inform you that your password is updated successfully',
        loginLink: 'https://tripbeyond.com/signin/agent',
      }),
    });

    return newHashedPassword;
  }

  /**===============================UPDATE AGENT PASSWORD =================================*/
  public async updatePassword(data) {
    const hasAgent = await this.findAgentByAgentID(data.agentID);
    if (!hasAgent) {
      throw new NotFoundException('Agent not found with the provided ID.');
    }

    const isPasswordMatched = await this.utilsService.comparePassword(
      data.password,
      hasAgent.user.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('Your provided password is not correct');
    }

    if (data.password === data.newPassword) {
      throw new BadRequestException(
        'Your new password should be different from your current password',
      );
    }

    const newHashedPassword = await this.utilsService.encryptPassword(
      data.newPassword,
    );

    //update pass to db
    return await this.updateAgentPassword(hasAgent.user.id, newHashedPassword);
  }

  /**=============================FIND AGENT BY EMAIL======================================== */
  public async findAgentByEmail(email: string) {
    return await this.prisma.agent.findFirst({
      where: { user: { email } },
      include: { user: true },
    });
  }

  /**=============================FIND AGENT BY AGENT_ID======================================== */
  public async findAgentByAgentID(agentID: number) {
    return await this.prisma.agent.findFirst({
      where: { agentID },
      include: { user: true },
    });
  }

  /**===============================UPDATE AGENT PASSWORD====================================== */
  public async updateAgentPassword(agentID, hashedPassword) {
    // mainly change the user password that password is hold by user model
    return await this.prisma.user.update({
      where: { id: agentID },
      data: { password: hashedPassword },
    });
  }
}
