import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet,TweetSchema } from './schemas/tweet.schema';
import { ToxicityService } from './toxicity.service';
import { TweetService } from './tweet.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }])],
  exports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }])],
  controllers: [],
  providers: [TweetService, ToxicityService],
})
export class TweetModule {}