import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop() user: string;
  @Prop() amount: string;
  @Prop() status: string;
  @Prop() txHash: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);