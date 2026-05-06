import { Injectable } from '@nestjs/common';
import {
    Registry,
    Counter,
    Histogram,
    collectDefaultMetrics
} from 'prom-client';

@Injectable()
export class MetricsService {
    readonly registry = new Registry();

    readonly jobsProcessed: Counter<string>;
    readonly rpcErrors: Counter<string>;
    readonly txFailures: Counter<string>;
    readonly jobDuration: Histogram<string>;

    constructor() {
        collectDefaultMetrics({
            register: this.registry
        });

        this.jobsProcessed = new Counter({
            name: 'jobs_processed_total',
            help: 'Total processed jobs',
            registers: [this.registry]
        });

        this.rpcErrors = new Counter({
            name: 'rpc_errors_total',
            help: 'RPC errors',
            registers: [this.registry]
        });

        this.txFailures = new Counter({
            name: 'tx_failures_total',
            help: 'Transaction failures',
            registers: [this.registry]
        });

        this.jobDuration = new Histogram({
            name: 'job_duration_seconds',
            help: 'Job processing duration',
            registers: [this.registry]
        });
    }
}