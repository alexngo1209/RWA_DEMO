import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TxService } from './tx.service';
import { OrderService } from '../order/order.service';

@Processor('tx-queue')
export class TxConsumer extends WorkerHost {
  constructor(
    private tx: TxService,
    private readonly orderService: OrderService,
  ) {
    super();
  }

  async process(job: Job) {
    const order = await this.orderService.findById(job.data.orderId);

    const tx = await this.tx.send(order);

    await this.orderService.markSubmitted(tx.hash);

    await tx.wait();
  }
}
