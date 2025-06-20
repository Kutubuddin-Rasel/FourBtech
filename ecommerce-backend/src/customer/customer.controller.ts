import { Controller, Get, Param, Post, Body, Put, UseGuards, Delete, Patch } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customer')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('stats')
  async getCustomerStats(@GetUser() user: User) {
    try {
      return await this.customerService.getCustomerStats(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('recent-activity')
  async getRecentActivity(@GetUser() user: User) {
    try {
      return await this.customerService.getRecentActivity(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Post('wishlist/:productId')
  async addProductToWishlist(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ) {
    try {
      return await this.customerService.addProductToWishlist(user.id, productId);
    } catch (error) {
      throw error;
    }
  }

  @Put('wishlist/:productId')
  async removeProductFromWishlist(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ) {
    try {
      return await this.customerService.removeProductFromWishlist(user.id, productId);
    } catch (error) {
      throw error;
    }
  }

  @Post('reviews/:productId')
  async addReview(
    @GetUser() user: User,
    @Param('productId') productId: string,
    @Body() reviewData: any,
  ) {
    try {
      return await this.customerService.addReview(user.id, productId, reviewData);
    } catch (error) {
      throw error;
    }
  }

  @Get('orders')
  async getCustomerOrders(@GetUser() user: User) {
    try {
      return await this.customerService.getCustomerOrders(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('wishlists')
  async getCustomerWishlists(@GetUser() user: User) {
    try {
      return await this.customerService.getCustomerWishlists(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('addresses')
  async getCustomerAddresses(@GetUser() user: User) {
    try {
      return await this.customerService.getCustomerAddresses(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Post('addresses')
  async addCustomerAddress(@GetUser() user: User, @Body() addressDto: { type: 'Home' | 'Work' | 'Other'; details: string; isDefault?: boolean }) {
    try {
      return await this.customerService.addCustomerAddress(user.id, addressDto);
    } catch (error) {
      console.error('Error in addCustomerAddress controller:', error);
      throw error;
    }
  }

  @Put('addresses/:id')
  async updateCustomerAddress(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() addressDto: { type?: 'Home' | 'Work' | 'Other'; details?: string; isDefault?: boolean }
  ) {
    try {
      return await this.customerService.updateCustomerAddress(user.id, id, addressDto);
    } catch (error) {
      console.error('Error in updateCustomerAddress controller:', error);
      throw error;
    }
  }

  @Delete('addresses/:id')
  async deleteCustomerAddress(@GetUser() user: User, @Param('id') id: string) {
    try {
      return await this.customerService.deleteCustomerAddress(user.id, id);
    } catch (error) {
      console.error('Error in deleteCustomerAddress controller:', error);
      throw error;
    }
  }

  @Patch('addresses/:id/default')
  async setDefaultCustomerAddress(@GetUser() user: User, @Param('id') id: string) {
    try {
      return await this.customerService.setDefaultCustomerAddress(user.id, id);
    } catch (error) {
      console.error('Error in setDefaultCustomerAddress controller:', error);
      throw error;
    }
  }
} 