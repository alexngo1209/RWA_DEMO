import { Module } from '@nestjs/common';
import { ContractsModule } from '@libs/contracts/contracts.module';
import { VaultController } from './vault.controller';

@Module({
    imports: [
        ContractsModule,
    ],
    controllers: [VaultController],
})
export class VaultModule { }