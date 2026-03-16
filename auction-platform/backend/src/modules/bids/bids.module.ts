import { Module } from '@nestjs/common';
import { AuctionsModule } from '../auctions/auctions.module';
import { BidsController } from './bids.controller';
import { BidsGateway } from './bids.gateway';
import { BidsService } from './bids.service';

@Module({
  imports: [AuctionsModule],
  controllers: [BidsController],
  providers: [BidsService, BidsGateway],
})
export class BidsModule {}
