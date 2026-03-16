import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'auctions',
  timestamps: true,
  versionKey: false,
})
export class AuctionDocument {
  @Prop({ required: true })
  sellerId!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true })
  categoryId!: string;

  @Prop({ required: true, min: 0 })
  startPrice!: number;

  @Prop({ required: true, min: 0 })
  currentPrice!: number;

  @Prop({ required: true, enum: ['draft', 'live', 'ended'], default: 'draft' })
  status!: 'draft' | 'live' | 'ended';

  @Prop({ required: true, type: Date })
  startsAt!: Date;

  @Prop({ required: true, type: Date })
  endsAt!: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export const AuctionSchema = SchemaFactory.createForClass(AuctionDocument);

AuctionSchema.index({ status: 1, endsAt: 1 });
AuctionSchema.index({ sellerId: 1 });
