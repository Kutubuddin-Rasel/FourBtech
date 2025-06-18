import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    // Implement email sending logic here
  }
} 