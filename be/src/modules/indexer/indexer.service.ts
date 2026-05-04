import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { BlockchainService } from '../blockchain/blockchain.service';
import { JOB_NAMES, QUEUE_NAMES } from 'src/constants/queue';

@Injectable()
export class IndexerService {
  private redis = new Redis();

  constructor(
    @InjectQueue(QUEUE_NAMES.INDEXER) private queue: Queue,
    private readonly blockchain: BlockchainService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async scan() {
    const lock = await this.redis.set('indexer-lock', '1', 'PX', 4000, 'NX');
    if (!lock) return;

    try {
      const lastBlock = Number(await this.redis.get('lastBlock')) || 0;

      const latest = await this.blockchain.getProvider().getBlockNumber();

      const fromBlock = Math.max(lastBlock - 5, 0);

      await this.queue.add(JOB_NAMES.SCAN_RANGE, {
        fromBlock,
        toBlock: latest,
      });

      await this.redis.set('lastBlock', latest);
    } finally {
      await this.redis.del('indexer-lock');
    }
  }
}
