import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '@libs/db/schemas/order.schema';
import { OrderStatus } from '@libs/db/schemas/@types';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>
    ) { }

    async create(dto: any) {
        return this.orderModel.create({
            ...dto,
            status: OrderStatus.PENDING
        });
    }

    async findAll() {
        return this.orderModel.find().lean();
    }

    async markCompleted(txHash: string) {
        await this.orderModel.updateOne(
            { txHash },
            { status: OrderStatus.COMPLETED }
        );
    }

    async rollbackFromBlock(blockNumber: number) {
        await this.orderModel.updateMany(
            { blockNumber: { $gte: blockNumber } },
            { status: OrderStatus.PENDING }
        );
    }
}