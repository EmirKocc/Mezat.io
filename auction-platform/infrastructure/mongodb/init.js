db = db.getSiblingDB('auction_platform');

db.createCollection('users');
db.createCollection('roles');
db.createCollection('categories');
db.createCollection('products');
db.createCollection('auctions');
db.createCollection('bids');
db.createCollection('orders');
db.createCollection('payments');
db.createCollection('livestreams');

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });

db.products.createIndex({ sellerId: 1 });
db.products.createIndex({ categoryId: 1 });

db.auctions.createIndex({ status: 1, endsAt: 1 });
db.auctions.createIndex({ sellerId: 1 });

db.bids.createIndex({ auctionId: 1, amount: -1 });
db.bids.createIndex({ createdAt: -1 });

db.orders.createIndex({ buyerId: 1, createdAt: -1 });
db.orders.createIndex({ sellerId: 1, createdAt: -1 });

db.payments.createIndex({ auctionId: 1 });
db.payments.createIndex({ winnerUserId: 1, createdAt: -1 });

db.livestreams.createIndex({ auctionId: 1 }, { unique: true });
db.livestreams.createIndex({ sellerId: 1, createdAt: -1 });
