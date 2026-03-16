import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateStreamDto } from './dto/create-stream.dto';

@Injectable()
export class LivestreamService {
  createStream(payload: CreateStreamDto) {
    return {
      streamId: randomUUID(),
      auctionId: payload.auctionId,
      sellerId: payload.sellerId,
      provider: 'agora',
      channelName: `auction-${payload.auctionId}`,
      token: 'agora-temporary-token', // placeholder: generate with Agora app cert.
    };
  }
}
