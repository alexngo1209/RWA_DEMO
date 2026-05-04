import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IndexEvent, IndexEventSchema } from './schema/index-event.schema';
import { IndexerService } from './indexer.service';
import { IndexerConsumer } from './indexer.consumer';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { OrderModule } from '../order/order.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAMES } from 'src/constants/queue';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: IndexEvent.name, schema: IndexEventSchema },
    ]),
    BullModule.registerQueue({
      name: QUEUE_NAMES.INDEXER,
    }),
    BlockchainModule,
    OrderModule,
  ],
  providers: [IndexerService, IndexerConsumer],
  exports: [IndexerService],
})
export class IndexerModule {}
