import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Specification } from './entities/specification.entity';
import { Tag } from './entities/tag.entity';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Specification, Tag]),
    VendorsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {} 