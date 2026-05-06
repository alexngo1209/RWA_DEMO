import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '@libs/shared/orders/dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() body: CreateOrderDto) {
    return this.orders.create({
      userId: req.user.userId,
      address: req.user.address,
      amount: body.amount,
      chainId: body.chainId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.orders.findAll({ userId: req.user.userId });
  }
}