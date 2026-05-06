import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';
import { ProviderFactory } from '@libs/blockchain/provider.factory';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NonceService {
    constructor(
        private readonly configService: ConfigService,
        private readonly providerFactory: ProviderFactory,
    ) { }

    private redis = new IORedis(this.configService.get<string>('redis.url'));

    private key(chainId: number, address: string) {
        return `nonce:${chainId}:${address}`;
    }

    async getNonce(chainId: number, address: string): Promise<number> {
        const key = this.key(chainId, address);

        const lock = await this.redis.setnx(`${key}:lock`, '1');
        if (!lock) {
            await new Promise(r => setTimeout(r, 100));
            return this.getNonce(chainId, address);
        }

        await this.redis.expire(`${key}:lock`, 5);

        try {
            let nonce = await this.redis.get(key);

            if (!nonce) {
                const provider = this.providerFactory.get(chainId);
                nonce = String(await provider.getTransactionCount(address, 'pending'));
            }

            const next = Number(nonce) + 1;
            await this.redis.set(key, next);

            return Number(nonce);
        } finally {
            await this.redis.del(`${key}:lock`);
        }
    }

    async reset(chainId: number, address: string) {
        await this.redis.del(this.key(chainId, address));
    }
}