import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OrderStatus } from './entities/order.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private productsService: ProductsService,
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createOrderDto: any): Promise<Order> {
    const cartItems = await this.cartService.getCart(userId);
    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    const customer = await this.userRepository.findOne({ where: { id: userId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const order = this.orderRepository.create({
      customer: customer,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      total: 0,
    });

    let totalAmount = 0;

    for (const cartItem of cartItems) {
      const product = await this.productsService.findOne(cartItem.productId);
      if (!product) {
        throw new NotFoundException(`Product ${cartItem.productId} not found`);
      }
      if (product.stock < cartItem.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const orderItem = this.orderItemRepository.create({
        order,
        product,
        quantity: cartItem.quantity,
        price: product.price,
      });

      await this.orderItemRepository.save(orderItem);
      totalAmount += product.price * cartItem.quantity;

      await this.productsService.update(product.id, {
        stock: product.stock - cartItem.quantity,
      });
    }

    order.total = totalAmount;
    await this.orderRepository.save(order);

    await this.cartService.clearCart(userId);

    await this.notificationsService.sendOrderConfirmation(customer.id, order.id);

    return this.findOne(order.id);
  }

  async findAll(userId: string, role: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customer: { id: userId } },
      relations: ['items', 'items.product', 'customer'],
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'customer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, userId: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.customer.id !== userId) {
      throw new BadRequestException('You can only update your own orders');
    }
    order.status = status;
    await this.orderRepository.save(order);
    await this.notificationsService.sendOrderStatusUpdate(order.customer.id, order.id, status);
    return order;
  }

  async cancelOrder(id: string, userId: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.customer.id !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    for (const item of order.items) {
      const product = await this.productsService.findOne(item.product.id);
      if (product) {
        await this.productsService.update(product.id, {
          stock: product.stock + item.quantity,
        });
      }
    }

    order.status = OrderStatus.CANCELLED;
    const updatedOrder = await this.orderRepository.save(order);

    await this.notificationsService.sendOrderCancellation(order.customer.id, order.id);

    return updatedOrder;
  }
} 