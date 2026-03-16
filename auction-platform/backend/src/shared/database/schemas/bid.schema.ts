import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'bids',
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class BidDocument {
  @Prop({ required: true })
  auctionId!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, min: 0 })
  amount!: number;

  createdAt!: Date;
}

export const BidSchema = SchemaFactory.createForClass(BidDocument);

BidSchema.index({ auctionId: 1, amount: -1 });
BidSchema.index({ createdAt: -1 });
