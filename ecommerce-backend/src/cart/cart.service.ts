import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      return this.cartItemRepository.save(cartItem);
    }

    cartItem = this.cartItemRepository.create({
      userId,
      productId,
      quantity,
    });

    return this.cartItemRepository.save(cartItem);
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = quantity;
    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(userId: string, cartItemId: string): Promise<void> {
    const result = await this.cartItemRepository.delete({ id: cartItemId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async getCart(userId: string): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.delete({ userId });
  }
} 