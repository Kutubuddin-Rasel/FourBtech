import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('preferences')
  getNotificationPreferences(@Request() req) {
    // TODO: Implement notification preferences
    return {
      email: true,
      push: false,
    };
  }
} 