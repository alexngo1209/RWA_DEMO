import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Block {
  @Prop() chainId: number;
  @Prop() blockNumber: number;
  @Prop() blockHash: string;
  @Prop() parentHash: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);

BlockSchema.index({ chainId: 1, blockNumber: 1 }, { unique: true });