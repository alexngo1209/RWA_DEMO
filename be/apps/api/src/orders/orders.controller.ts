import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '@libs/shared/orders/dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) { }

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.orders.create(body);
  }

  @Get()
  findAll() {
    return this.orders.findAll();
  }
}