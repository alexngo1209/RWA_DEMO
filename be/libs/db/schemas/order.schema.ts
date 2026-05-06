import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from './@types';

@Schema({ timestamps: true })
export class Order {
  @Prop() user: string;
  @Prop() amount: string;
  @Prop() status: OrderStatus;
  @Prop() txHash: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);