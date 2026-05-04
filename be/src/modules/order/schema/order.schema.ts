import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '../@types';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  user: string;

  @Prop()
  amount: string;

  @Prop()
  txHash: string;

  @Prop({
    type: String,
    enum: [
      OrderStatus.FAILED,
      OrderStatus.PENDING,
      OrderStatus.SUBMITTED,
      OrderStatus.SUCCESS,
    ],
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
