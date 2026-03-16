import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AUCTIONS_REPOSITORY } from '../../shared/repositories/auctions.repository';
import type { AuctionsRepository } from '../../shared/repositories/auctions.repository';
import { PlaceBidDto } from './dto/place-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @Inject(AUCTIONS_REPOSITORY)
    private readonly auctionsRepository: AuctionsRepository,
  ) {}

  async placeBid(payload: PlaceBidDto) {
    const auction = await this.auctionsRepository.findAuctionById(payload.auctionId);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (payload.amount <= auction.currentPrice) {
      throw new BadRequestException('Bid must be higher than current price');
    }

    const bid = await this.auctionsRepository.createBid({
      auctionId: payload.auctionId,
      userId: payload.userId,
      amount: payload.amount,
    });

    const updatedAuction = await this.auctionsRepository.updateCurrentPrice(
      payload.auctionId,
      payload.amount,
    );

    return {
      bid,
      auction: updatedAuction,
    };
  }

  async listBids(auctionId: string) {
    return this.auctionsRepository.listAuctionBids(auctionId);
  }
}
