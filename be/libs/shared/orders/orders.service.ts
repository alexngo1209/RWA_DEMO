import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '@libs/db/schemas/order.schema';
import { OrderStatus } from '@libs/db/schemas/@types';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>
    ) { }

    async create(dto: CreateOrderDto) {
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

    async matchDeposit(address: string, amount: string, txHash: string, blockNumber: number) {
        const order = await this.orderModel.findOne({
            address,
            amount,
            status: OrderStatus.PENDING
        }).sort({ createdAt: 1 });

        if (!order) return;

        order.status = OrderStatus.COMPLETED;
        order.txHash = txHash;
        order.blockNumber = blockNumber;

        await order.save();
    }

    async matchWithdraw(address: string, amount: string, txHash: string, blockNumber: number) {
        /// do something when withdraw is matched
    }
}