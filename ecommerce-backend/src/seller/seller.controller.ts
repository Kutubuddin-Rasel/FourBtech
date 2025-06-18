import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SellerService } from './seller.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';

@Controller('seller')
@Roles(UserRole.SELLER)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('stats')
  getSellerStats(@GetUser() user: User) {
    return this.sellerService.getSellerStats(user.id);
  }

  @Get('products')
  getSellerProducts(@GetUser() user: User) {
    return this.sellerService.getSellerProducts(user.id);
  }

  @Post('products')
  createProduct(@GetUser() user: User, @Body() createProductDto: CreateProductDto) {
    return this.sellerService.createProduct(user.id, createProductDto);
  }

  @Put('products/:productId')
  updateProduct(
    @GetUser() user: User,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.sellerService.updateProduct(user.id, productId, updateProductDto);
  }

  @Delete('products/:productId')
  deleteProduct(@GetUser() user: User, @Param('productId') productId: string) {
    return this.sellerService.deleteProduct(user.id, productId);
  }

  @Get('orders')
  getSellerOrders(@GetUser() user: User) {
    return this.sellerService.getSellerOrders(user.id);
  }

  @Put('orders/:orderId/status')
  updateOrderStatus(
    @GetUser() user: User,
    @Param('orderId') orderId: string,
    @Body() updateStatusDto: any, // Define a DTO for updateStatusDto
  ) {
    return this.sellerService.updateOrderStatus(user.id, orderId, updateStatusDto.status);
  }
} 