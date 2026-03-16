import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuctionEntity } from '../domain/auction.entity';
import { BidEntity } from '../domain/bid.entity';
import { AuctionsRepository } from './auctions.repository';

@Injectable()
export class InMemoryAuctionsRepository implements AuctionsRepository {
  private readonly auctions = new Map<string, AuctionEntity>();
  private readonly bids = new Map<string, BidEntity[]>();

  createAuction(
    input: Omit<AuctionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuctionEntity> {
    const now = new Date().toISOString();
    const auction: AuctionEntity = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.auctions.set(auction.id, auction);
    this.bids.set(auction.id, []);
    return Promise.resolve(auction);
  }

  listAuctions(categoryId?: string): Promise<AuctionEntity[]> {
    const all = Array.from(this.auctions.values());
    if (!categoryId) {
      return Promise.resolve(all);
    }
    return Promise.resolve(all.filter((auction) => auction.categoryId === categoryId));
  }

  findAuctionById(auctionId: string): Promise<AuctionEntity | null> {
    return Promise.resolve(this.auctions.get(auctionId) ?? null);
  }

  createBid(
    input: Omit<BidEntity, 'id' | 'createdAt'>,
  ): Promise<BidEntity> {
    const bid: BidEntity = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const auctionBids = this.bids.get(input.auctionId) ?? [];
    auctionBids.push(bid);
    this.bids.set(input.auctionId, auctionBids);
    return Promise.resolve(bid);
  }

  listAuctionBids(auctionId: string): Promise<BidEntity[]> {
    return Promise.resolve(this.bids.get(auctionId) ?? []);
  }

  updateCurrentPrice(
    auctionId: string,
    amount: number,
  ): Promise<AuctionEntity | null> {
    const auction = this.auctions.get(auctionId);
    if (!auction) {
      return Promise.resolve(null);
    }

    const updated: AuctionEntity = {
      ...auction,
      currentPrice: amount,
      updatedAt: new Date().toISOString(),
    };
    this.auctions.set(auctionId, updated);
    return Promise.resolve(updated);
  }
}
