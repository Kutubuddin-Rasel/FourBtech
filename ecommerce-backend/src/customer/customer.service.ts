import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { Review } from '../reviews/entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getCustomerStats(customerId: string) {
    try {
      const [totalOrders, wishlistItems, pendingReviews] = await Promise.all([
        this.orderRepository.count({ where: { customer: { id: customerId } } }),
        this.wishlistRepository.count({ where: { customer: { id: customerId } } }),
        this.reviewRepository.count({ where: { customer: { id: customerId }, status: 'pending' } }),
      ]);

      return {
        totalOrders,
        wishlistItems,
        pendingReviews,
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  }

  async getRecentActivity(customerId: string) {
    try {
      const [orders, reviews] = await Promise.all([
        this.orderRepository.find({
          where: { customer: { id: customerId } },
          order: { createdAt: 'DESC' },
          take: 5,
          relations: ['items', 'items.product'],
        }),
        this.reviewRepository.find({
          where: { customer: { id: customerId } },
          order: { createdAt: 'DESC' },
          take: 5,
          relations: ['product'],
        }),
      ]);

      const activities = [
        ...orders.map(order => ({
          type: 'order',
          date: order.createdAt,
          description: `Ordered ${order.items.length} items`,
          status: order.status,
          orderId: order.id,
        })),
        ...reviews.map(review => ({
          type: 'review',
          date: review.createdAt,
          description: `Reviewed ${review.product.name}`,
          status: review.status,
          productId: review.product.id,
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

      return activities;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async addProductToWishlist(customerId: string, productId: string) {
    const customer = await this.userRepository.findOne({ where: { id: customerId } });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!customer || !product) {
      throw new NotFoundException('Customer or Product not found');
    }

    const existingWishlistItem = await this.wishlistRepository.findOne({ where: { customer: { id: customerId }, product: { id: productId } } });
    if (existingWishlistItem) {
      return existingWishlistItem; // Already in wishlist
    }

    const wishlistItem = this.wishlistRepository.create({ customer, product });
    return this.wishlistRepository.save(wishlistItem);
  }

  async removeProductFromWishlist(customerId: string, productId: string) {
    const wishlistItem = await this.wishlistRepository.findOne({ where: { customer: { id: customerId }, product: { id: productId } } });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.wishlistRepository.remove(wishlistItem);
    return { message: 'Product removed from wishlist' };
  }

  async addReview(customerId: string, productId: string, reviewData: any) {
    const customer = await this.userRepository.findOne({ where: { id: customerId } });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!customer || !product) {
      throw new NotFoundException('Customer or Product not found');
    }

    const review = this.reviewRepository.create({
      ...reviewData,
      customer,
      product,
      status: 'pending', // Reviews might initially be pending approval
    });
    return this.reviewRepository.save(review);
  }

  async getCustomerOrders(customerId: string) {
    return this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCustomerWishlists(customerId: string) {
    try {
      return await this.wishlistRepository.find({
        where: { customer: { id: customerId } },
        relations: ['product'],
      });
    } catch (error) {
      console.error('Error fetching customer wishlists:', error);
      throw error;
    }
  }

  async getCustomerAddresses(customerId: string) {
    return this.addressRepository.find({ where: { user: { id: customerId } }, order: { isDefault: 'DESC', createdAt: 'DESC' } });
  }

  async addCustomerAddress(customerId: string, addressDto: { type: 'Home' | 'Work' | 'Other'; details: string; isDefault?: boolean }) {
    const user = await this.userRepository.findOne({ where: { id: customerId } });
    if (!user) throw new NotFoundException('User not found');
    // If isDefault is true, unset previous default addresses
    if (addressDto.isDefault) {
      await this.addressRepository.update({ user: { id: customerId }, isDefault: true }, { isDefault: false });
    }
    const address = this.addressRepository.create({
      ...addressDto,
      user,
      isDefault: !!addressDto.isDefault,
    });
    return this.addressRepository.save(address);
  }

  async updateCustomerAddress(customerId: string, addressId: string, addressDto: { type?: 'Home' | 'Work' | 'Other'; details?: string; isDefault?: boolean }) {
    const address = await this.addressRepository.findOne({ where: { id: addressId, user: { id: customerId } } });
    if (!address) throw new NotFoundException('Address not found');
    if (addressDto.isDefault) {
      await this.addressRepository.update({ user: { id: customerId }, isDefault: true }, { isDefault: false });
    }
    Object.assign(address, addressDto);
    if (addressDto.isDefault !== undefined) address.isDefault = !!addressDto.isDefault;
    return this.addressRepository.save(address);
  }

  async deleteCustomerAddress(customerId: string, addressId: string) {
    const address = await this.addressRepository.findOne({ where: { id: addressId, user: { id: customerId } } });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepository.remove(address);
    return { message: 'Address deleted' };
  }

  async setDefaultCustomerAddress(customerId: string, addressId: string) {
    const address = await this.addressRepository.findOne({ where: { id: addressId, user: { id: customerId } } });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepository.update({ user: { id: customerId }, isDefault: true }, { isDefault: false });
    address.isDefault = true;
    return this.addressRepository.save(address);
  }
} 