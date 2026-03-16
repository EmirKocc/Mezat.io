export type AuctionStatus = 'draft' | 'live' | 'ended';

export interface AuctionEntity {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  categoryId: string;
  startPrice: number;
  currentPrice: number;
  status: AuctionStatus;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}