import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '@libs/db/schemas/event.schema';
import { Block } from '@libs/db/schemas/block.schema';
import { BlockTrackerService } from '@libs/reorg/block-tracker.service';
import { OrdersService } from '../../api/src/orders/orders.service';
import { MetricsService } from '@libs/metrics/metrics.service';

@Processor('default')
export class DefaultProcessor extends WorkerHost {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Block.name) private blockModel: Model<Block>,
    private readonly tracker: BlockTrackerService,
    private readonly ordersService: OrdersService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const end = this.metrics.jobDuration.startTimer();

    try {
      switch (job.name) {
        case 'events':
          return this.handleEvents(job.data);
        case 'blocks':
          return this.handleBlocks(job.data);
      }
      this.metrics.jobsProcessed.inc();
    } finally {
      end();
    }


  }

  private async handleEvents(data: any) {
    const { chainId, logs } = data;

    const ops = logs.map((log: any) => ({
      updateOne: {
        filter: {
          chainId,
          txHash: log.transactionHash,
          logIndex: log.logIndex
        },
        update: {
          chainId,
          txHash: log.transactionHash,
          logIndex: log.logIndex,
          blockNumber: log.blockNumber,
          data: log
        },
        upsert: true
      }
    }));

    if (ops.length) {
      await this.eventModel.bulkWrite(ops);
    }

    // 🔥 Example: link event → order
    for (const log of logs) {
      await this.ordersService.markCompleted(log.transactionHash);
    }
  }

  private async handleBlocks(data: any) {
    const { chainId, blocks } = data;
    await this.tracker.saveBlocks(blocks, chainId);
  }
}