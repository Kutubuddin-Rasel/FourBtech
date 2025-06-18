import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getSellerStats(sellerId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [salesToday, salesWeek, salesMonth, orders, lowStockProducts] = await Promise.all([
      this.getSalesForPeriod(sellerId, startOfDay, endOfDay),
      this.getSalesForPeriod(sellerId, startOfWeek, endOfWeek),
      this.getSalesForPeriod(sellerId, startOfMonth, endOfMonth),
      this.getOrderCounts(sellerId),
      this.getLowStockProducts(sellerId),
    ]);

    return {
      salesToday,
      salesWeek,
      salesMonth,
      orders,
      lowStockCount: lowStockProducts.length,
    };
  }

  private async getSalesForPeriod(sellerId: string, startDate: Date, endDate: Date) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.seller.id = :sellerId', { sellerId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status != :status', { status: OrderStatus.CANCELLED })
      .select('SUM(item.price * item.quantity)', 'total')
      .getRawOne();

    return result?.total || 0;
  }

  private async getOrderCounts(sellerId: string) {
    const counts = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.seller.id = :sellerId', { sellerId })
      .select('order.status', 'status')
      .addSelect('COUNT(DISTINCT order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const statusCounts = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PROCESSING]: 0,
      [OrderStatus.SHIPPED]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELLED]: 0,
    };

    counts.forEach(({ status, count }) => {
      if (status in statusCounts) {
        statusCounts[status] = parseInt(count);
      }
    });

    return statusCounts;
  }

  private async getLowStockProducts(sellerId: string) {
    return this.productRepository.find({
      where: {
        seller: { id: sellerId },
        stock: LessThan(10),
      },
    });
  }

  async getSellerProducts(sellerId: string) {
    return this.productRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['vendor', 'specifications', 'tags'],
    });
  }

  async createProduct(sellerId: string, createProductDto: CreateProductDto) {
    const seller = await this.userRepository.findOne({ where: { id: sellerId } });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    const product = this.productRepository.create({
      ...createProductDto,
      seller,
    });
    return this.productRepository.save(product);
  }

  async updateProduct(sellerId: string, productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id: productId, seller: { id: sellerId } } });
    if (!product) {
      throw new NotFoundException('Product not found or not owned by seller');
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async deleteProduct(sellerId: string, productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId, seller: { id: sellerId } } });
    if (!product) {
      throw new NotFoundException('Product not found or not owned by seller');
    }
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async getSellerOrders(sellerId: string) {
    return this.orderRepository.find({
      where: {
        items: {
          product: {
            seller: { id: sellerId },
          },
        },
      },
      relations: ['customer', 'items', 'items.product'],
    });
  }

  async updateOrderStatus(sellerId: string, orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product.seller', 'customer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify the order contains at least one product from this seller
    const isSellerOrder = order.items.some(item => item.product.seller.id === sellerId);

    if (!isSellerOrder) {
      throw new BadRequestException('You do not have permission to update this order.');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}