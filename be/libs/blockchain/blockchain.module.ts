import { Module } from '@nestjs/common';
import { ProviderFactory } from './provider.factory';
import { ConfigModule } from '@libs/config/config.module';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [ProviderFactory],
  exports: [ProviderFactory],
})
export class BlockchainModule { }
