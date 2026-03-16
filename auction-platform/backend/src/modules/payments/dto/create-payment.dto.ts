import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'a49f5b19-7fd0-4d24-af8c-f0739f7b7c0b' })
  @IsString()
  auctionId!: string;

  @ApiProperty({ example: 'fd55fb59-17bc-4ca5-aaf3-66f43ef1f7eb' })
  @IsString()
  winnerUserId!: string;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({ enum: ['stripe', 'iyzico'] })
  @IsIn(['stripe', 'iyzico'])
  provider!: 'stripe' | 'iyzico';
}
