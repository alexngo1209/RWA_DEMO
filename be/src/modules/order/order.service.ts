import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from './@types';
import { Order } from './schema/order.schema';
import { JOB_NAMES, QUEUE_NAMES } from 'src/constants/queue';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>,
    @InjectQueue(QUEUE_NAMES.TX) private queue: Queue,
  ) {}

  async create(user: string, amount: string) {
    const order = await this.model.create({
      user,
      amount,
    });

    await this.queue.add(JOB_NAMES.SEND_TX, {
      orderId: order._id.toString(),
    });

    return order;
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async updateTx(orderId: string, txHash: string) {
    await this.model.updateOne({ _id: orderId }, { txHash });
  }

  async markSubmitted(txHash: string) {
    await this.model.updateOne({ txHash }, { status: OrderStatus.SUBMITTED });
  }

  async markSuccess(txHash: string) {
    await this.model.updateOne({ txHash }, { status: OrderStatus.SUCCESS });
  }
}
