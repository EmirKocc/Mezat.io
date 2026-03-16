import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Create payment request for winning bid' })
  requestPayment(@Body() payload: CreatePaymentDto) {
    return this.paymentsService.createPaymentRequest(payload);
  }
}
