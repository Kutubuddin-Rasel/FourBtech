import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Request() req, @Body() createCartItemDto: CreateCartItemDto) {
    const { productId, quantity } = createCartItemDto;
    return this.cartService.addToCart(req.user.id.toString(), productId.toString(), quantity);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch(':id')
  updateQuantity(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;
    return this.cartService.updateQuantity(req.user.id, id, quantity);
  }

  @Delete(':id')
  removeFromCart(@Request() req, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
} 