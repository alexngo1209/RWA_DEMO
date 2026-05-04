import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';
import Redis from 'ioredis';

@Injectable()
export class NonceService {
  redis = new Redis();

  async get(address: string, provider: JsonRpcProvider) {
    const key = `nonce:${address}`;
    let nonce: any = await this.redis.get(key);

    if (!nonce) {
      nonce = await provider.getTransactionCount(address, 'pending');
    }

    await this.redis.set(key, Number(nonce) + 1);

    return Number(nonce);
  }
}
