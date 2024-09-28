import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor() {}

  public async encryptPassword(
    password: string,
    saltRounds = 10,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  public generatePassword(): string {
    const date = new Date();

    // Get date components (e.g., year, month, day, etc.)
    const year = date.getFullYear().toString().slice(-2); // last two digits of the year
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // month (01-12)
    const day = ('0' + date.getDate()).slice(-2); // day (01-31)
    const hours = ('0' + date.getHours()).slice(-2); // hours (00-23)
    const minutes = ('0' + date.getMinutes()).slice(-2); // minutes (00-59)
    const seconds = ('0' + date.getSeconds()).slice(-2); // seconds (00-59)

    // Combine the date components with some random characters for security
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase(); // Generate random string of 4 characters

    // Construct the password
    const password = `${year}${month}${day}${hours}${minutes}${seconds}${randomChars}`;

    return password;
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**============================HTTP RESPONSE CREATOR=================================== */

  public successResponse(message: string, rest = {}) {
    return {
      message,
      ...rest,
    };
  }
}
