import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TweetDocument = Tweet & Document;

@Schema()
export class Tweet {
  @Prop()
  tweetId: string;

  @Prop()
  authorId: string;

  @Prop()
  username: string;

  @Prop()
  text: string;

  @Prop()
  createdAt: Date;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);