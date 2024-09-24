import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      secure: true, // false
      host: 'smtp.gmail.com',
      port: 465, //587
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  // mail for register agent to inform them about agentID and Password
  public async sendMail({ to, subject, html }): Promise<void> {
    console.log('process.env.SENDER_EMAIL', process.env.SENDER_EMAIL);
    const mailOptions: nodemailer.SendMailOptions = {
      from: {
        name: 'Trip Beyond',
        address: process.env.SENDER_EMAIL,
      },
      to,
      subject,
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // mail for agent forgot password
}
