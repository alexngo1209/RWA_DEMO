import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '@libs/db/schemas/event.schema';
import { Block } from '@libs/db/schemas/block.schema';
import { BlockTrackerService } from '@libs/reorg/block-tracker.service';
import { OrdersService } from '@libs/shared/orders/orders.service';
import { DecoderService } from '@libs/contracts/decoder.service';

@Processor('default')
export class DefaultProcessor extends WorkerHost {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Block.name) private blockModel: Model<Block>,
    private readonly tracker: BlockTrackerService,
    private readonly ordersService: OrdersService,
    private readonly decoder: DecoderService
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case 'events':
        return this.handleEvents(job.data);
      case 'blocks':
        return this.handleBlocks(job.data);
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

    // 🔥 DOMAIN MAPPING (REAL PRODUCTION PATTERN)
    for (const log of logs) {
      const decoded = this.decoder.decode(log);
      if (!decoded) continue;

      if (decoded.name === 'Deposit') {
        const address = decoded.args.user.toLowerCase();
        const amount = decoded.args.amount.toString();
        const orderId = decoded.args.orderId.toString();

        await this.ordersService.matchDeposit(address, amount, orderId, log.transactionHash, log.blockNumber);

        console.log('Deposit detected:', address, amount, orderId, log.transactionHash, log.blockNumber);
      }

      if (decoded.name === 'Withdraw') {
        const address = decoded.args.user.toLowerCase();
        const amount = decoded.args.amount.toString();

        await this.ordersService.matchWithdraw(address, amount, log.transactionHash, log.blockNumber);

        console.log('Withdraw detected', address, amount);
      }
    }
  }

  private async handleBlocks(data: any) {
    const { chainId, blocks } = data;
    await this.tracker.saveBlocks(blocks, chainId);
  }
}