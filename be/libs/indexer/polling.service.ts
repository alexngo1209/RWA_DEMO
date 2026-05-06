import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProviderFactory } from '@libs/blockchain/provider.factory';
import { BlockStateService } from './block-state.service';
import { QueueService } from '@libs/queue/queue.service';
import { ReorgService } from '@libs/reorg/reorg.service';
import { CHAINS, BATCH_SIZE } from './constants';
import { MetricsService } from '@libs/metrics/metrics.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PollingService {
    private readonly logger = new Logger(PollingService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly providerFactory: ProviderFactory,
        private readonly state: BlockStateService,
        private readonly queue: QueueService,
        private readonly reorg: ReorgService,
        private readonly metrics: MetricsService
    ) { }

    @Cron('*/10 * * * * *')
    async poll() {
        for (const chainId of CHAINS) {
            await this.processChain(chainId);
        }
    }

    private async processChain(chainId: number) {
        const provider = this.providerFactory.get(chainId);

        const latest = await provider.getBlockNumber();

        let from = await this.state.getLastBlock(chainId);
        if (!from) {
            from = latest - 5000;
        }

        let to = Math.min(from + BATCH_SIZE, latest);
        if (to <= from) return;

        // 🔥 REORG CHECK
        await this.reorg.check(chainId, from, to);

        this.logger.log(`Polling ${chainId}: ${from} -> ${to}`);

        try {
            const logs = await provider.getLogs({
                fromBlock: from,
                toBlock: to,
                address: this.configService.get('contracts')[chainId]
            });
            if (logs.length) {
                await this.queue.add('events', {
                    chainId,
                    logs
                });
            }
        } catch {
            this.metrics.rpcErrors.inc();
        }



        const blocks = [];
        for (let i = from; i <= to; i++) {
            const block = await provider.getBlock(i);
            if (block) blocks.push(block);
        }

        await this.queue.add('blocks', {
            chainId,
            blocks
        });

        await this.state.setLastBlock(chainId, to);
    }
}