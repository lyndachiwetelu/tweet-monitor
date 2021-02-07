import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetricDocument = Metric & Document;

@Schema()
export class Metric {
  @Prop()
  count: number;

  @Prop()
  from: Date;

  @Prop()
  to: Date;

  @Prop()
  createdAt: Date;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);