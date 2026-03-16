import { Inject, Injectable } from '@nestjs/common';
import { AUCTIONS_REPOSITORY } from '../../shared/repositories/auctions.repository';
import type { AuctionsRepository } from '../../shared/repositories/auctions.repository';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Injectable()
export class AuctionsService {
  constructor(
    @Inject(AUCTIONS_REPOSITORY)
    private readonly auctionsRepository: AuctionsRepository,
  ) {}

  async createAuction(payload: CreateAuctionDto) {
    return this.auctionsRepository.createAuction({
      sellerId: payload.sellerId,
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      startPrice: payload.startPrice,
      currentPrice: payload.startPrice,
      status: 'draft',
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
    });
  }

  async listAuctions(categoryId?: string) {
    return this.auctionsRepository.listAuctions(categoryId);
  }
}
