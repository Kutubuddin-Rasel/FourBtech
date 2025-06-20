import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Order } from '../orders/entities/order.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { Review } from '../reviews/entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Wishlist, Review, Product, User, Address]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {} 