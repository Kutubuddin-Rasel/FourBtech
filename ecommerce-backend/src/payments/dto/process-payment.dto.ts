import { IsNumber, IsEnum, Min } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class ProcessPaymentDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
} 