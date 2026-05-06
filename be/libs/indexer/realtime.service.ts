import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ProviderFactory } from '@libs/blockchain/provider.factory';
import { QueueService } from '@libs/queue/queue.service';
import { CHAINS } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RealtimeService implements OnModuleInit {
    private readonly logger = new Logger(RealtimeService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly providerFactory: ProviderFactory,
        private readonly queue: QueueService
    ) { }

    async onModuleInit() {
        for (const chainId of CHAINS) {
            this.listen(chainId);
        }
    }

    private listen(chainId: number) {
        const provider = this.providerFactory.get(chainId);

        this.logger.log(`Realtime listening chain ${chainId}`);

        provider.on(
            {
                address: this.configService.get('contracts')[chainId]
            },
            async log => {
                await this.queue.add('events', {
                    chainId,
                    logs: [log]
                });
            }
        );
    }
}