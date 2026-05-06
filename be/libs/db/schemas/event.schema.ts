import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop() chainId: number;
  @Prop() txHash: string;
  @Prop() logIndex: number;
  @Prop() blockNumber: number;
  @Prop({ type: Object }) data: any;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ chainId: 1, txHash: 1, logIndex: 1 }, { unique: true });
EventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });