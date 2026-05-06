import { Module } from '@nestjs/common';
import { ConfigModule } from '@libs/config/config.module';
import { DbModule } from '@libs/db/db.module';
import { QueueModule } from '@libs/queue/queue.module';
import { BlockchainModule } from '@libs/blockchain/blockchain.module';
import { TxEngineModule } from '@libs/tx-engine/tx-engine.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    QueueModule,
    BlockchainModule,
    TxEngineModule,
    AuthModule,
    OrdersModule
  ],
  controllers: [HealthController]
})
export class AppModule { }