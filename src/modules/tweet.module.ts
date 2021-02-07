import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet,TweetSchema } from '../schemas/tweet.schema';
import { ToxicityService } from '../services/toxicity.service';
import { TweetService } from '../services/tweet.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }], 'tweets')],
  exports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }], 'tweets')],
  controllers: [],
  providers: [TweetService, ToxicityService],
})
export class TweetModule {}