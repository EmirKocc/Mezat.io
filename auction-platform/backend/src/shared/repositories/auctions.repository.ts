import { AuctionEntity } from '../domain/auction.entity';
import { BidEntity } from '../domain/bid.entity';

export const AUCTIONS_REPOSITORY = 'AUCTIONS_REPOSITORY';

export interface AuctionsRepository {
  createAuction(
    input: Omit<AuctionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuctionEntity>;
  listAuctions(categoryId?: string): Promise<AuctionEntity[]>;
  findAuctionById(auctionId: string): Promise<AuctionEntity | null>;
  createBid(input: Omit<BidEntity, 'id' | 'createdAt'>): Promise<BidEntity>;
  listAuctionBids(auctionId: string): Promise<BidEntity[]>;
  updateCurrentPrice(
    auctionId: string,
    amount: number,
  ): Promise<AuctionEntity | null>;
}
