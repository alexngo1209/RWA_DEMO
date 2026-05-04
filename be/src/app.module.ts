import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './modules/order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IndexerModule } from './modules/indexer/indexer.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { TxModule } from './modules/tx/tx.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/rwa'),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BlockchainModule,
    OrderModule,
    TxModule,
    IndexerModule,
  ],
})
export class AppModule {}
