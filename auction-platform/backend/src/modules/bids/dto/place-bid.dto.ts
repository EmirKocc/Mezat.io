import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class PlaceBidDto {
  @ApiProperty({ example: 'd5ca5a8d-a9ff-4f92-9bff-636f48debc57' })
  @IsString()
  auctionId!: string;

  @ApiProperty({ example: '8d831f7f-2340-440a-8f0e-66ac3f2d60fc' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(1)
  amount!: number;
}
