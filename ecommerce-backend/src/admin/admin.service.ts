import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { UserRole } from '../auth/decorators/roles.decorator';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAdminStats() {
    const [totalSellers, totalProducts, pendingOrders] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.SELLER } }),
      this.productRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
    ]);

    return {
      totalSellers,
      totalProducts,
      pendingOrders,
    };
  }
} 