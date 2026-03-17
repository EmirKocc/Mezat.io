export type JoinAuctionPayload = {
  auctionId: string;
  userId: string;
};

export type LeaveAuctionPayload = {
  auctionId: string;
  userId: string;
};

export type PlaceBidPayload = {
  auctionId: string;
  userId: string;
  amount: number;
};

export type NewBidBroadcastPayload = {
  auctionId: string;
  bidId: string;
  userId: string;
  amount: number;
  placedAt: string;
};

export type AuctionEndPayload = {
  auctionId: string;
  winnerUserId: string | null;
  finalAmount: number | null;
};

export const SOCKET_EVENTS = {
  JOIN_AUCTION: 'joinAuction',
  LEAVE_AUCTION: 'leaveAuction',
  PLACE_BID: 'placeBid',
  NEW_BID_BROADCAST: 'newBidBroadcast',
  AUCTION_END: 'auctionEnd',
} as const;
