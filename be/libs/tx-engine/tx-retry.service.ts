import { MetricsService } from '@libs/metrics/metrics.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TxRetryService {
    constructor(
        private readonly metrics: MetricsService
    ) { }

    private readonly logger = new Logger(TxRetryService.name);

    async retry(fn: () => Promise<any>, retries = 5) {
        let attempt = 0;

        while (attempt < retries) {
            try {
                return await fn();
            } catch (err: any) {
                attempt++;

                this.metrics.txFailures.inc();
                this.logger.warn(`TX retry ${attempt}: ${err.message}`);

                if (attempt >= retries) throw err;

                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
    }
}