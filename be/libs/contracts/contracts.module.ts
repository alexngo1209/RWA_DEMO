import { Module } from '@nestjs/common';
import { DecoderService } from './decoder.service';
import { VaultService } from './vault.service';
import { TxEngineModule } from '@libs/tx-engine/tx-engine.module';
import { BlockchainModule } from '@libs/blockchain/blockchain.module';

@Module({
    imports: [
        TxEngineModule,
        BlockchainModule
    ],
    providers: [
        DecoderService,
        VaultService
    ],
    exports: [
        DecoderService,
        VaultService
    ]
})
export class ContractsModule { }