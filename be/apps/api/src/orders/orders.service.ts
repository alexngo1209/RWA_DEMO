import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '@libs/db/schemas/order.schema';
import { OrderStatus } from '@libs/db/schemas/@types';
import { CreateOrderDto } from '@libs/shared/orders/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>
  ) { }

  async create(dto: CreateOrderDto) {
    const order = await this.orderModel.create({
      userId: dto.userId,
      address: dto.address,
      amount: dto.amount,
      chainId: dto.chainId,
      status: OrderStatus.PENDING
    });

    return {
      orderId: order._id.toString(),
      ...order.toObject()
    };
  }

  async findAll(filter: { userId?: string, address?: string }) {
    const query = {};
    if (filter.userId) {
      query['userId'] = filter.userId;
    }
    if (filter.address) {
      query['address'] = filter.address;
    }
    return this.orderModel.find(query).lean();
  }
}