import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'payments',
  timestamps: true,
  versionKey: false,
})
export class PaymentDocument {
  @Prop({ required: true })
  auctionId!: string;

  @Prop({ required: true })
  winnerUserId!: string;

  @Prop({ required: true, min: 1 })
  amount!: number;

  @Prop({ required: true, enum: ['stripe', 'iyzico'] })
  provider!: 'stripe' | 'iyzico';

  @Prop({
    required: true,
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending',
  })
  status!: 'pending' | 'succeeded' | 'failed';

  @Prop({ required: false })
  transactionId?: string;

  @Prop({ required: false })
  redirectUrl?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);

PaymentSchema.index({ auctionId: 1 });
PaymentSchema.index({ winnerUserId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
