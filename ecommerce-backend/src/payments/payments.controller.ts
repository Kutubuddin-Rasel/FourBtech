import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRole } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @Roles(UserRole.CUSTOMER)
  processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(processPaymentDto);
  }

  @Get('order/:orderId')
  getPaymentByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(+orderId);
  }

  @Post(':id/refund')
  refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(+id);
  }
} 