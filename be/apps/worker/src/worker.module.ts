import { Module } from '@nestjs/common';
import { QueueModule } from '@libs/queue/queue.module';
import { IndexerModule } from '@libs/indexer/indexer.module';
import { ReorgModule } from '@libs/reorg/reorg.module';
import { DbModule } from '@libs/db/db.module';
import { OrdersModule } from '../../api/src/orders/orders.module';
import { DefaultProcessor } from './processor';
import { MetricsModule } from '@libs/metrics/metrics.module';

@Module({
  imports: [
    QueueModule,
    IndexerModule,
    ReorgModule,
    DbModule,
    OrdersModule,
    MetricsModule,

  ],
  providers: [DefaultProcessor]
})
export class WorkerModule { }