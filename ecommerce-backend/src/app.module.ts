// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { CustomerModule } from './customer/customer.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewsModule } from './reviews/reviews.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // Load .env into process.env and make ConfigService global
    ConfigModule.forRoot({ isGlobal: true }),

    // Configure TypeORM dynamically based on env vars
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';
        const port = parseInt(
          config.get<string>('DB_PORT', '5432'), // default to 5432 if undefined
          10
        );

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port,
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProd,
          // Add SSL when in production (often required by managed Postgres)
          ssl: isProd ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    // Your application modules
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    AdminModule,
    SellerModule,
    CustomerModule,
    WishlistModule,
    ReviewsModule,
  ],
  providers: [
    // Globally apply JWT auth and roles guards
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
