import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { AUCTIONS_REPOSITORY } from '../../shared/repositories/auctions.repository';
import { MongoDbAuctionsRepository } from '../../shared/repositories/mongodb-auctions.repository';
import {
  AuctionDocument,
  AuctionSchema,
} from '../../shared/database/schemas/auction.schema';
import {
  BidDocument,
  BidSchema,
} from '../../shared/database/schemas/bid.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuctionDocument.name, schema: AuctionSchema },
      { name: BidDocument.name, schema: BidSchema },
    ]),
  ],
  controllers: [AuctionsController],
  providers: [
    AuctionsService,
    {
      provide: AUCTIONS_REPOSITORY,
      useClass: MongoDbAuctionsRepository,
    },
  ],
  exports: [AUCTIONS_REPOSITORY],
})
export class AuctionsModule {}
