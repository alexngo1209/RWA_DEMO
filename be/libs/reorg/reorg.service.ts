import { Injectable, Logger } from '@nestjs/common';
import { ProviderFactory } from '@libs/blockchain/provider.factory';
import { BlockTrackerService } from './block-tracker.service';
import { RollbackService } from './rollback.service';

@Injectable()
export class ReorgService {
    private readonly logger = new Logger(ReorgService.name);

    constructor(
        private readonly providerFactory: ProviderFactory,
        private readonly tracker: BlockTrackerService,
        private readonly rollbackService: RollbackService
    ) { }

    async check(chainId: number, from: number, to: number) {
        const provider = this.providerFactory.get(chainId);

        for (let i = from; i <= to; i++) {
            const onchain = await provider.getBlock(i);
            const stored = await this.tracker.getBlock(chainId, i);

            if (!onchain) continue;

            if (!stored) {
                await this.tracker.saveBlocks([onchain], chainId);
                continue;
            }

            if (stored.blockHash !== onchain.hash) {
                this.logger.error(`Reorg at block ${i}`);

                const reorgPoint = await this.findReorgPoint(chainId, i);
                await this.rollbackService.rollback(chainId, reorgPoint);
                return;
            }
        }
    }

    private async findReorgPoint(chainId: number, start: number): Promise<number> {
        const provider = this.providerFactory.get(chainId);

        let current = start;

        while (current > 0) {
            const onchain = await provider.getBlock(current);
            const stored = await this.tracker.getBlock(chainId, current);

            if (!onchain || !stored) return current;

            if (onchain.hash === stored.blockHash) {
                return current + 1;
            }

            current--;
        }

        return 0;
    }
}