import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'I am trip beyond api! Explore me with my other endpoints!';
  }
}
