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
      ...dto,
      status: OrderStatus.PENDING
    });
    return order;
  }

  async findAll() {
    return this.orderModel.find().lean();
  }
}