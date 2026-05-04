import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { OrderService } from '../order/order.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IndexEvent } from './schema/index-event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

const iface = new ethers.Interface([
  'event Bought(address indexed user, uint amount)',
]);

@Processor('indexer-queue')
export class IndexerConsumer extends WorkerHost {
  constructor(
    @InjectModel(IndexEvent.name) private model: Model<IndexEvent>,
    private readonly configService: ConfigService,
    private readonly blockchain: BlockchainService,
    private readonly orderService: OrderService,
  ) {
    super();
  }
  async process(job: Job) {
    const { fromBlock, toBlock } = job.data;

    const logs = await this.blockchain.getProvider().getLogs({
      fromBlock,
      toBlock,
      address: this.configService.get('contractAddress', ''),
    });

    for (const log of logs) {
      const id = `${log.transactionHash}-${log.index}`;

      const exists = await this.model.findOne({ id });
      if (exists) continue;

      await this.model.create({ id });

      const parsed = iface.parseLog(log);

      if (parsed.name === 'Bought') {
        await this.orderService.markSuccess(log.transactionHash);
      }
    }
  }
}
