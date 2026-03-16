import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AuctionsModule } from './modules/auctions/auctions.module';
import { BidsModule } from './modules/bids/bids.module';
import { LivestreamModule } from './modules/livestream/livestream.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UsersModule } from './modules/users/users.module';
import configuration from './shared/config/configuration';
import { MongoDbModule } from './shared/database/mongodb.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongoDbModule,
    AuthModule,
    UsersModule,
    AuctionsModule,
    BidsModule,
    PaymentsModule,
    LivestreamModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
