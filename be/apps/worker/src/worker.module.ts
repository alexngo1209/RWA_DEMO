import { Module } from '@nestjs/common';
import { QueueModule } from '@libs/queue/queue.module';
import { IndexerModule } from '@libs/indexer/indexer.module';
import { ReorgModule } from '@libs/reorg/reorg.module';
import { DbModule } from '@libs/db/db.module';
import { DefaultProcessor } from './processor';
import { MetricsModule } from '@libs/metrics/metrics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '@libs/db/schemas/event.schema';
import { Block, BlockSchema } from '@libs/db/schemas/block.schema';
import { ContractsModule } from '@libs/contracts/contracts.module';
import { OrdersModule } from '@libs/shared/orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Block.name, schema: BlockSchema }
    ]),
    QueueModule,
    IndexerModule,
    ReorgModule,
    DbModule,
    OrdersModule,
    MetricsModule,
    ContractsModule

  ],
  providers: [DefaultProcessor]
})
export class WorkerModule { }