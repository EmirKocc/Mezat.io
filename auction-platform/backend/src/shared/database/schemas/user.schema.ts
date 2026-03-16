import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class UserDocument {
  @Prop({ required: true, lowercase: true, trim: true, unique: true })
  email!: string;

  @Prop({ required: false })
  passwordHash?: string;

  @Prop({ required: true, enum: ['buyer', 'seller'], default: 'buyer' })
  role!: 'buyer' | 'seller';

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false })
  refreshTokenHash?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

UserSchema.index({ role: 1 });
