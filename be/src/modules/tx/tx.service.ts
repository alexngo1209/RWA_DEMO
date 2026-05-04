import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';
import { NonceService } from './nonce.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TxService {
  constructor(
    private readonly configService: ConfigService,
    private readonly blockchain: BlockchainService,
    private readonly nonce: NonceService,
  ) {}

  async send(order: any) {
    const wallet = this.blockchain.getWallet(
      this.configService.get('privateKey', ''),
    );

    const nonce = await this.nonce.get(
      wallet.address,
      this.blockchain.getProvider(),
    );

    const abi = ['function buy() payable'];

    const contract = this.blockchain.getContract(
      this.configService.get('contractAddress', ''),
      abi,
      wallet,
    );

    return contract.buy({
      value: ethers.parseEther(order.amount),
      nonce,
    });
  }
}
