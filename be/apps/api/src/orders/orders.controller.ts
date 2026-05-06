import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) { }

  @Post()
  create(@Body() body: any) {
    return this.orders.create(body);
  }

  @Get()
  findAll() {
    return this.orders.findAll();
  }
}