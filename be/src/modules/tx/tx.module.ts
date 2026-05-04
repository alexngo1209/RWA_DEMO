import { Module } from '@nestjs/common';
import { TxService } from './tx.service';
import { NonceService } from './nonce.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { OrderModule } from '../order/order.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BlockchainModule, OrderModule, ConfigModule],
  providers: [TxService, NonceService],
  exports: [TxService, NonceService],
})
export class TxModule {}
