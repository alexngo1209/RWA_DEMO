import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private service: OrderService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body.user, body.amount);
  }
}
