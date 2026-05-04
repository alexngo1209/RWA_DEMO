import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from './@types';
import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>,
    @InjectQueue('tx-queue') private queue: Queue,
  ) {}

  async create(user: string, amount: string) {
    const order = await this.model.create({
      user,
      amount,
    });

    await this.queue.add('send-tx', {
      orderId: order._id.toString(),
    });

    return order;
  }

  async updateTx(orderId: string, txHash: string) {
    await this.model.updateOne({ _id: orderId }, { txHash });
  }

  async markSuccess(txHash: string) {
    await this.model.updateOne({ txHash }, { status: OrderStatus.SUCCESS });
  }
}
