import { Module } from '@nestjs/common';
import { TxService } from './tx.service';
import { NonceService } from './nonce.service';
import { GasService } from './gas.service';
import { TxRetryService } from './tx-retry.service';
import { BlockchainModule } from '@libs/blockchain/blockchain.module';
import { ConfigModule } from '@libs/config/config.module';

@Module({
    imports: [ConfigModule, BlockchainModule],
    providers: [
        TxService,
        NonceService,
        GasService,
        TxRetryService
    ],
    exports: [TxService]
})
export class TxEngineModule { }