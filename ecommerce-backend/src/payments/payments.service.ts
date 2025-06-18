import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['order'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment as Payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async processPayment(processPaymentDto: ProcessPaymentDto): Promise<Payment> {
    const { orderId, amount, paymentMethod } = processPaymentDto;

    // Create payment record
    const payment = this.paymentRepository.create({
      orderId,
      amount,
      method: paymentMethod,
      status: PaymentStatus.PENDING,
    });

    try {
      // TODO: Integrate with actual payment gateway
      // This is a mock implementation
      switch (paymentMethod) {
        case PaymentMethod.CREDIT_CARD:
        case PaymentMethod.DEBIT_CARD:
          // Simulate card payment processing
          await this.simulateCardPayment(payment);
          break;
        case PaymentMethod.PAYPAL:
          // Simulate PayPal payment processing
          await this.simulatePayPalPayment(payment);
          break;
        case PaymentMethod.BANK_TRANSFER:
          // Simulate bank transfer processing
          await this.simulateBankTransfer(payment);
          break;
        default:
          throw new BadRequestException('Invalid payment method');
      }

      return payment;
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.errorMessage = error.message;
      await this.paymentRepository.save(payment);
      throw error;
    }
  }

  private async simulateCardPayment(payment: Payment): Promise<void> {
    // Simulate API call to payment gateway
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment
    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = `CARD_${Date.now()}`;
    await this.paymentRepository.save(payment);
  }

  private async simulatePayPalPayment(payment: Payment): Promise<void> {
    // Simulate API call to PayPal
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment
    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = `PAYPAL_${Date.now()}`;
    await this.paymentRepository.save(payment);
  }

  private async simulateBankTransfer(payment: Payment): Promise<void> {
    // Simulate bank transfer processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment
    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = `BANK_${Date.now()}`;
    await this.paymentRepository.save(payment);
  }

  async getPaymentByOrderId(orderId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { orderId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with orderId ${orderId} not found`);
    }
    return payment;
  }

  async refundPayment(paymentId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }
    // TODO: Integrate with actual payment gateway for refund
    // This is a mock implementation
    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepository.save(payment);
  }
} 