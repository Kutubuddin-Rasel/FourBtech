import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly emailService: EmailService) {}

  async sendOrderConfirmation(userId: string, orderId: string): Promise<void> {
    await this.emailService.sendMail(
      'user@example.com', // TODO: Get user email from user service
      'Order Confirmation',
      `Order ${orderId} has been confirmed.`
    );
  }

  async sendOrderStatusUpdate(userId: string, orderId: string, status: OrderStatus): Promise<void> {
    await this.emailService.sendMail(
      'user@example.com', // TODO: Get user email from user service
      'Order Status Update',
      `Order ${orderId} status has been updated to ${status}.`
    );
  }

  async sendOrderCancellation(userId: string, orderId: string): Promise<void> {
    await this.emailService.sendMail(
      'user@example.com', // TODO: Get user email from user service
      'Order Cancelled',
      `Order ${orderId} has been cancelled.`
    );
  }

  async sendPasswordReset(userId: number, resetToken: string): Promise<void> {
    await this.emailService.sendMail(
      'user@example.com', // TODO: Get user email from user service
      'Password Reset Request',
      `Your password reset token is: ${resetToken}`
    );
  }

  async sendWelcomeEmail(userId: number): Promise<void> {
    await this.emailService.sendMail(
      'user@example.com', // TODO: Get user email from user service
      'Welcome to Our Platform',
      'Welcome to our platform!'
    );
  }
} 