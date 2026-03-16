import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuctionEntity } from '../domain/auction.entity';
import { BidEntity } from '../domain/bid.entity';
import { AuctionsRepository } from './auctions.repository';

@Injectable()
export class InMemoryAuctionsRepository implements AuctionsRepository {
  private readonly auctions = new Map<string, AuctionEntity>();
  private readonly bids = new Map<string, BidEntity[]>();

  async createAuction(
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
    return auction;
  }

  async listAuctions(categoryId?: string): Promise<AuctionEntity[]> {
    const all = Array.from(this.auctions.values());
    if (!categoryId) {
      return all;
    }
    return all.filter((auction) => auction.categoryId === categoryId);
  }

  async findAuctionById(auctionId: string): Promise<AuctionEntity | null> {
    return this.auctions.get(auctionId) ?? null;
  }

  async createBid(input: Omit<BidEntity, 'id' | 'createdAt'>): Promise<BidEntity> {
    const bid: BidEntity = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const auctionBids = this.bids.get(input.auctionId) ?? [];
    auctionBids.push(bid);
    this.bids.set(input.auctionId, auctionBids);
    return bid;
  }

  async listAuctionBids(auctionId: string): Promise<BidEntity[]> {
    return this.bids.get(auctionId) ?? [];
  }

  async updateCurrentPrice(auctionId: string, amount: number): Promise<AuctionEntity | null> {
    const auction = this.auctions.get(auctionId);
    if (!auction) {
      return null;
    }

    const updated: AuctionEntity = {
      ...auction,
      currentPrice: amount,
      updatedAt: new Date().toISOString(),
    };
    this.auctions.set(auctionId, updated);
    return updated;
  }
}