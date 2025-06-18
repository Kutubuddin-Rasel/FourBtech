import { Controller, Get, Param, Post, Body, Put, UseGuards } from '@nestjs/common';
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
      console.error('Error in getCustomerStats controller:', error);
      throw error;
    }
  }

  @Get('recent-activity')
  async getRecentActivity(@GetUser() user: User) {
    try {
      return await this.customerService.getRecentActivity(user.id);
    } catch (error) {
      console.error('Error in getRecentActivity controller:', error);
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
      console.error('Error in addProductToWishlist controller:', error);
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
      console.error('Error in removeProductFromWishlist controller:', error);
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
      console.error('Error in addReview controller:', error);
      throw error;
    }
  }

  @Get('orders')
  async getCustomerOrders(@GetUser() user: User) {
    try {
      return await this.customerService.getCustomerOrders(user.id);
    } catch (error) {
      console.error('Error in getCustomerOrders controller:', error);
      throw error;
    }
  }

  @Get('wishlists')
  async getCustomerWishlists(@GetUser() user: User) {
    try {
      return await this.customerService.getCustomerWishlists(user.id);
    } catch (error) {
      console.error('Error in getCustomerWishlists controller:', error);
      throw error;
    }
  }
} 