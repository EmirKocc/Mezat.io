import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStreamDto {
  @ApiProperty({ example: '2b482f11-62ec-4d30-b8e2-36f8f923ad15' })
  @IsString()
  auctionId!: string;

  @ApiProperty({ example: 'fd74bc24-b7a9-4368-8d98-3e14dc5628b5' })
  @IsString()
  sellerId!: string;
}
