import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArchiveDocument = Archive & Document;

@Schema()
export class Archive {
  @Prop({ type: Object })
  data: Object;

  @Prop()
  type: string;

  @Prop()
  createdAt: Date;
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);