import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { ConfigModule,
         ConfigService }    from '@nestjs/config';
import { APP_GUARD }         from '@nestjs/core';

import { AppController }     from './app.controller';
import { AppService }        from './app.service';
import { JwtAuthGuard }      from './auth/guards/jwt-auth.guard';
import { RolesGuard }        from './auth/guards/roles.guard';

import { AuthModule }        from './auth/auth.module';
import { UsersModule }       from './users/users.module';
import { ProductsModule }    from './products/products.module';
import { OrdersModule }      from './orders/orders.module';
import { CartModule }        from './cart/cart.module';
import { AdminModule }       from './admin/admin.module';
import { SellerModule }      from './seller/seller.module';
import { CustomerModule }    from './customer/customer.module';
import { WishlistModule }    from './wishlist/wishlist.module';
import { ReviewsModule }     from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),

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
  controllers: [AppController],  // ← Register your root controller
  providers: [
    AppService,                  // ← Provide the service for it
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
