import { Module } from '@nestjs/common';
import { TxService } from './tx.service';
import { NonceService } from './nonce.service';
import { GasService } from './gas.service';
import { TxRetryService } from './tx-retry.service';
import { BlockchainModule } from '@libs/blockchain/blockchain.module';
import { ConfigModule } from '@libs/config/config.module';
import { MetricsModule } from '@libs/metrics/metrics.module';

@Module({
    imports: [ConfigModule, BlockchainModule, MetricsModule],
    providers: [
        TxService,
        NonceService,
        GasService,
        TxRetryService
    ],
    exports: [TxService]
})
export class TxEngineModule { }