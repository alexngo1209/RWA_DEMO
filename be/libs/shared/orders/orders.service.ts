import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '@libs/db/schemas/order.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>
    ) { }

    async create(dto: any) {
        return this.orderModel.create({
            ...dto,
            status: 'pending'
        });
    }

    async findAll() {
        return this.orderModel.find().lean();
    }

    async markCompleted(txHash: string) {
        await this.orderModel.updateOne(
            { txHash },
            { status: 'completed' }
        );
    }

    async rollbackFromBlock(blockNumber: number) {
        await this.orderModel.updateMany(
            { blockNumber: { $gte: blockNumber } },
            { status: 'pending' }
        );
    }
}