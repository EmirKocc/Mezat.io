import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'livestreams',
  timestamps: true,
  versionKey: false,
})
export class LivestreamDocument {
  @Prop({ required: true })
  auctionId!: string;

  @Prop({ required: true })
  sellerId!: string;

  @Prop({ required: true, enum: ['agora'], default: 'agora' })
  provider!: 'agora';

  @Prop({ required: true })
  channelName!: string;

  @Prop({ required: true })
  token!: string;

  @Prop({ required: false, type: Date })
  tokenExpiresAt?: Date;

  @Prop({ required: true, enum: ['active', 'ended'], default: 'active' })
  status!: 'active' | 'ended';

  createdAt!: Date;
  updatedAt!: Date;
}

export const LivestreamSchema =
  SchemaFactory.createForClass(LivestreamDocument);

LivestreamSchema.index({ auctionId: 1 }, { unique: true });
LivestreamSchema.index({ sellerId: 1, createdAt: -1 });
LivestreamSchema.index({ status: 1 });
