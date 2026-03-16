import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { PlaceBidDto } from './dto/place-bid.dto';

@ApiTags('bids')
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new bid (HTTP fallback)' })
  async placeBid(@Body() payload: PlaceBidDto) {
    return this.bidsService.placeBid(payload);
  }

  @Get(':auctionId')
  @ApiOperation({ summary: 'List bids for an auction' })
  async listBids(@Param('auctionId') auctionId: string) {
    return this.bidsService.listBids(auctionId);
  }
}
