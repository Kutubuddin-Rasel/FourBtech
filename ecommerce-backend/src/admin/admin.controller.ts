import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/decorators/roles.decorator';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getAdminStats() {
    return this.adminService.getAdminStats();
  }
}