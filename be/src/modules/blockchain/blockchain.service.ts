import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

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
