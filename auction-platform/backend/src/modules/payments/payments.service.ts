import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  createPaymentRequest(payload: CreatePaymentDto) {
    return {
      paymentId: randomUUID(),
      status: 'pending',
      provider: payload.provider,
      amount: payload.amount,
      redirectUrl: `https://payment-gateway.local/${payload.provider}`, // placeholder
    };
  }
}
