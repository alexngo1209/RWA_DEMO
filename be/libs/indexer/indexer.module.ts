import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PollingService } from './polling.service';
import { RealtimeService } from './realtime.service';
import { BlockStateService } from './block-state.service';
import { BlockchainModule } from '@libs/blockchain/blockchain.module';
import { QueueModule } from '@libs/queue/queue.module';
import { DbModule } from '@libs/db/db.module';
import { MetricsModule } from '@libs/metrics/metrics.module';
import { ConfigModule } from '@libs/config/config.module';
import { ReorgModule } from '@libs/reorg/reorg.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BlockchainModule,
    QueueModule,
    DbModule,
    MetricsModule,
    ConfigModule,
    ReorgModule,
  ],
  providers: [
    PollingService,
    RealtimeService,
    BlockStateService
  ],
  exports: []
})
export class IndexerModule { }