import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockStateService {
    constructor(private readonly configService: ConfigService) { }
    private redis = new IORedis({
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port')
    });

    async getLastBlock(chainId: number): Promise<number | null> {
        const v = await this.redis.get(`block:${chainId}`);
        return v ? Number(v) : null;
    }

    async setLastBlock(chainId: number, block: number) {
        await this.redis.set(`block:${chainId}`, block);
    }
}