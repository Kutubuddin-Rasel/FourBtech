import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/decorators/roles.decorator';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('profile')
  @Roles(UserRole.VENDOR)
  create(@Body() createVendorDto: CreateVendorDto, @Request() req) {
    return this.vendorsService.create(createVendorDto, req.user);
  }

  @Get('profile')
  @Roles(UserRole.VENDOR)
  findOne(@Request() req) {
    return this.vendorsService.findOne(req.user);
  }

  @Patch('profile')
  @Roles(UserRole.VENDOR)
  update(@Body() updateVendorDto: UpdateVendorDto, @Request() req) {
    return this.vendorsService.update(req.user, updateVendorDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findById(@Param('id') id: string) {
    return this.vendorsService.findById(id);
  }
} 