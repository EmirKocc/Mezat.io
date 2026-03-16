import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsString, Min } from 'class-validator';

export class CreateAuctionDto {
  @ApiProperty({ example: 'a13b3ce7-287e-4d53-a169-8cefcf836129' })
  @IsString()
  sellerId!: string;

  @ApiProperty({ example: 'Vintage Bronze Clock' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Early 1900s bronze mantle clock.' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 'caaaf4aa-c326-490f-8d0d-1141e8f97bdf' })
  @IsString()
  categoryId!: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  startPrice!: number;

  @ApiProperty({ example: '2026-03-12T18:00:00.000Z' })
  @IsISO8601()
  startsAt!: string;

  @ApiProperty({ example: '2026-03-12T19:00:00.000Z' })
  @IsISO8601()
  endsAt!: string;
}
