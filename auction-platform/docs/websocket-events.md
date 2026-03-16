# WebSocket Event Contract (MVP)

Namespace: `/auctions`

## Events

### `joinAuction`
Client -> Server

```json
{
  "auctionId": "uuid",
  "userId": "uuid"
}
```

### `leaveAuction`
Client -> Server

```json
{
  "auctionId": "uuid",
  "userId": "uuid"
}
```

### `placeBid`
Client -> Server

```json
{
  "auctionId": "uuid",
  "userId": "uuid",
  "amount": 150
}
```

### `newBidBroadcast`
Server -> Clients in auction room

```json
{
  "auctionId": "uuid",
  "bidId": "uuid",
  "userId": "uuid",
  "amount": 150,
  "placedAt": "2026-03-11T10:10:00.000Z"
}
```

### `auctionEnd`
Server -> Clients in auction room

```json
{
  "auctionId": "uuid",
  "winnerUserId": "uuid",
  "finalAmount": 350
}
```

## Notes
- Current implementation uses in-memory repository as placeholder.
- Replace with Redis + MongoDB backed workflow for production consistency.
