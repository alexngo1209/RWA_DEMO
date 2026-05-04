import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IndexEventDocument = HydratedDocument<IndexEvent>;

@Schema()
export class IndexEvent {
  @Prop()
  id: string;
}

export const IndexEventSchema = SchemaFactory.createForClass(IndexEvent);
