import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new auction' })
  async createAuction(@Body() payload: CreateAuctionDto) {
    return this.auctionsService.createAuction(payload);
  }

  @Get()
  @ApiOperation({ summary: 'List auctions with optional category filter' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  async listAuctions(@Query('categoryId') categoryId?: string) {
    return this.auctionsService.listAuctions(categoryId);
  }
}
