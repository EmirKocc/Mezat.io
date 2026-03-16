import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../../shared/contracts/socket-events';
import type {
  JoinAuctionPayload,
  LeaveAuctionPayload,
  NewBidBroadcastPayload,
  PlaceBidPayload,
} from '../../shared/contracts/socket-events';
import { BidsService } from './bids.service';

@WebSocketGateway({
  namespace: '/auctions',
  cors: {
    origin: '*',
  },
})
export class BidsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly bidsService: BidsService) {}

  @SubscribeMessage(SOCKET_EVENTS.JOIN_AUCTION)
  handleJoinAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinAuctionPayload,
  ) {
    void client.join(payload.auctionId);
    return { event: SOCKET_EVENTS.JOIN_AUCTION, joined: true };
  }

  @SubscribeMessage(SOCKET_EVENTS.LEAVE_AUCTION)
  handleLeaveAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveAuctionPayload,
  ) {
    void client.leave(payload.auctionId);
    return { event: SOCKET_EVENTS.LEAVE_AUCTION, left: true };
  }

  @SubscribeMessage(SOCKET_EVENTS.PLACE_BID)
  async handlePlaceBid(@MessageBody() payload: PlaceBidPayload) {
    const result = await this.bidsService.placeBid(payload);
    const broadcast: NewBidBroadcastPayload = {
      auctionId: payload.auctionId,
      bidId: result.bid.id,
      userId: payload.userId,
      amount: payload.amount,
      placedAt: result.bid.createdAt,
    };

    this.server
      .to(payload.auctionId)
      .emit(SOCKET_EVENTS.NEW_BID_BROADCAST, broadcast);

    return {
      event: SOCKET_EVENTS.NEW_BID_BROADCAST,
      payload: broadcast,
    };
  }
}
