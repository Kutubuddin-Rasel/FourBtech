import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '../../payments/entities/payment.entity';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
} 