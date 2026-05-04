import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get('rpcUrl', ''),
    );
  }

  getProvider() {
    return this.provider;
  }

  getWallet(privateKey: string) {
    return new ethers.Wallet(privateKey, this.provider);
  }

  getContract(address: string, abi: any, signer?: any) {
    return new ethers.Contract(address, abi, signer || this.provider);
  }
}
