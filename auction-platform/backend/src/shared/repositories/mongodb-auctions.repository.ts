import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuctionEntity } from '../domain/auction.entity';
import { BidEntity } from '../domain/bid.entity';
import { AuctionDocument } from '../database/schemas/auction.schema';
import { BidDocument } from '../database/schemas/bid.schema';
import { AuctionsRepository } from './auctions.repository';

@Injectable()
export class MongoDbAuctionsRepository implements AuctionsRepository {
  constructor(
    @InjectModel(AuctionDocument.name)
    private readonly auctionModel: Model<AuctionDocument>,
    @InjectModel(BidDocument.name)
    private readonly bidModel: Model<BidDocument>,
  ) {}

  async createAuction(
    input: Omit<AuctionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuctionEntity> {
    const created = await this.auctionModel.create({
      ...input,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
    });

    return this.mapAuction(created);
  }

  async listAuctions(categoryId?: string): Promise<AuctionEntity[]> {
    const filter = categoryId ? { categoryId } : {};
    const auctions = await this.auctionModel.find(filter).sort({ createdAt: -1 }).exec();

    return auctions.map((auction) => this.mapAuction(auction));
  }

  async findAuctionById(auctionId: string): Promise<AuctionEntity | null> {
    const auction = await this.auctionModel.findById(auctionId).exec();
    return auction ? this.mapAuction(auction) : null;
  }

  async createBid(input: Omit<BidEntity, 'id' | 'createdAt'>): Promise<BidEntity> {
    const created = await this.bidModel.create(input);
    return this.mapBid(created);
  }

  async listAuctionBids(auctionId: string): Promise<BidEntity[]> {
    const bids = await this.bidModel
      .find({ auctionId })
      .sort({ amount: -1, createdAt: -1 })
      .exec();

    return bids.map((bid) => this.mapBid(bid));
  }

  async updateCurrentPrice(auctionId: string, amount: number): Promise<AuctionEntity | null> {
    const updated = await this.auctionModel
      .findByIdAndUpdate(
        auctionId,
        {
          currentPrice: amount,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    return updated ? this.mapAuction(updated) : null;
  }

  private mapAuction(auction: AuctionDocument & { _id: { toString(): string } }): AuctionEntity {
    return {
      id: auction._id.toString(),
      sellerId: auction.sellerId,
      title: auction.title,
      description: auction.description,
      categoryId: auction.categoryId,
      startPrice: auction.startPrice,
      currentPrice: auction.currentPrice,
      status: auction.status,
      startsAt: new Date(auction.startsAt).toISOString(),
      endsAt: new Date(auction.endsAt).toISOString(),
      createdAt: new Date(auction.createdAt).toISOString(),
      updatedAt: new Date(auction.updatedAt).toISOString(),
    };
  }

  private mapBid(bid: BidDocument & { _id: { toString(): string } }): BidEntity {
    return {
      id: bid._id.toString(),
      auctionId: bid.auctionId,
      userId: bid.userId,
      amount: bid.amount,
      createdAt: new Date(bid.createdAt).toISOString(),
    };
  }
}
